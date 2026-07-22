import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Users,
  Building2,
  ArrowRight,
  Send,
} from "lucide-react";

interface Opportunity {
  id: number;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  duration: string | null;
  slotsAvailable: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  employerId: number;
  employer: {
    id: number;
    userId: number;
    companyName: string;
    companyAddress: string | null;
    contactPerson: string | null;
    phone: string | null;
    industry: string | null;
    user: {
      id: number;
      name: string | null;
      email: string | null;
    };
  };
}

export default function StudentInternships() {
  const utils = trpc.useUtils();
  const { data: opportunities, isLoading } = trpc.opportunity.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");

  const applyMutation = trpc.application.create.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      setSelectedOpp(null);
      setCoverLetter("");
      setResumeFile(null);
      setResumeUrl("");
      utils.application.listByStudent.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit application");
    },
  });

  const filteredOpportunities = opportunities?.filter((opp) =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opp.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleApply = () => {
    if (!selectedOpp) return;
    
    // For now, use the resume URL from cloud storage or file name
    let finalResumeUrl = resumeUrl;
    if (resumeFile) {
      // In a real app, you'd upload the file to cloud storage here
      // For now, just use the file name as a placeholder
      finalResumeUrl = `pending-upload/${resumeFile.name}`;
      toast.info("Resume will be uploaded: " + resumeFile.name);
    }
    
    applyMutation.mutate({
      opportunityId: selectedOpp.id,
      coverLetter: coverLetter || undefined,
      resumeUrl: finalResumeUrl || undefined,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
      setResumeUrl(""); // Clear URL if file is selected
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 -top-6 h-48 overflow-hidden rounded-lg">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop" 
            alt="Professional workspace"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        </div>
        <div className="relative">
          <h1 className="text-2xl font-bold text-slate-900">Browse Internships</h1>
          <p className="text-slate-500">Explore approved internship opportunities from top employers</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search by title, description, or location..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filteredOpportunities && filteredOpportunities.length > 0 ? (
        <div className="grid gap-4">
          {filteredOpportunities.map((opp: Opportunity) => (
            <Card key={opp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{opp.title}</h3>
                      <Badge className="bg-green-100 text-green-700">approved</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Building2 className="w-4 h-4" />
                      <span>{opp.employer.companyName}</span>
                      <span className="text-slate-300">|</span>
                      <MapPin className="w-4 h-4" />
                      <span>{opp.location || "Remote"}</span>
                      <span className="text-slate-300">|</span>
                      <Clock className="w-4 h-4" />
                      <span>{opp.duration}</span>
                    </div>
                    <p className="text-slate-600 mb-3">{opp.description}</p>
                    {opp.requirements && (
                      <div className="bg-slate-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium text-slate-700 mb-1">Requirements:</p>
                        <p className="text-sm text-slate-600">{opp.requirements}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>{opp.slotsAvailable} slot{opp.slotsAvailable !== 1 ? 's' : ''} available</span>
                    </div>
                  </div>
                  <Dialog open={selectedOpp?.id === opp.id} onOpenChange={(open) => !open && setSelectedOpp(null)}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 shrink-0" onClick={() => setSelectedOpp(opp)}>
                        <Send className="w-4 h-4" />
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Apply for {opp.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-slate-700">{opp.employer.companyName}</p>
                          <p className="text-sm text-slate-500">{opp.location} · {opp.duration}</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                          <Textarea
                            id="coverLetter"
                            placeholder="Tell us why you&apos;re a good fit for this position..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="resume">Resume/CV</Label>
                          <div className="space-y-3">
                            <div>
                              <Input
                                id="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                              />
                              {resumeFile && (
                                <p className="text-sm text-green-600 mt-1">
                                  Selected: {resumeFile.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-px bg-slate-200" />
                              <span className="text-xs text-slate-400">OR</span>
                              <div className="flex-1 h-px bg-slate-200" />
                            </div>
                            <div>
                              <Label htmlFor="resumeUrl" className="text-sm">Cloud Storage URL</Label>
                              <Input
                                id="resumeUrl"
                                type="url"
                                placeholder="https://drive.google.com/... or https://dropbox.com/..."
                                value={resumeUrl}
                                onChange={(e) => {
                                  setResumeUrl(e.target.value);
                                  if (e.target.value) setResumeFile(null);
                                }}
                                disabled={!!resumeFile}
                              />
                              <p className="text-xs text-slate-500 mt-1">
                                Share link from Google Drive, Dropbox, OneDrive, etc.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full gap-2"
                          onClick={handleApply}
                          disabled={applyMutation.isPending}
                        >
                          {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500">
            {searchTerm ? "No internships match your search." : "No approved internships available yet."}
          </p>
        </div>
      )}
    </div>
  );
}
