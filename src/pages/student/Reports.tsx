import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
} from "lucide-react";

export default function StudentReports() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: applications } = trpc.application.listByStudent.useQuery(
    { studentUserId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  const acceptedApp = applications?.find((a) => a.status === "accepted");

  const { data: reports, isLoading } = trpc.report.listByPlacement.useQuery(
    { placementId: acceptedApp?.placement?.id || 0 },
    { enabled: !!acceptedApp?.placement?.id }
  );

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [weekNumber, setWeekNumber] = useState("");

  const createReport = trpc.report.create.useMutation({
    onSuccess: () => {
      toast.success("Report submitted successfully!");
      setIsOpen(false);
      setTitle("");
      setContent("");
      setWeekNumber("");
      utils.report.listByPlacement.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit report");
    },
  });

  const handleSubmit = () => {
    if (!acceptedApp?.placement?.id) return;
    createReport.mutate({
      placementId: acceptedApp.placement.id,
      title,
      content,
      weekNumber: weekNumber ? parseInt(weekNumber) : undefined,
    });
  };

  const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending: { label: "Under Review", className: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
    approved: { label: "Approved", className: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
    rejected: { label: "Needs Revision", className: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
  };

  if (!acceptedApp) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
          <p className="text-slate-500">Submit weekly logbooks and track report status</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Internship</h3>
            <p className="text-slate-500 mb-4 max-w-md mx-auto">
              You need to be placed in an internship before you can submit reports.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
          <p className="text-slate-500">
            Submit weekly logbooks for {acceptedApp.opportunity.title} at {acceptedApp.opportunity.employer.companyName}
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit New Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="week">Week Number</Label>
                <Input
                  id="week"
                  type="number"
                  placeholder="e.g., 4"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Week 4: API Development"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Report Content</Label>
                <Textarea
                  id="content"
                  placeholder="Describe your activities, achievements, and learnings this week..."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <Button
                className="w-full gap-2"
                onClick={handleSubmit}
                disabled={!title || !content || createReport.isPending}
              >
                {createReport.isPending ? "Submitting..." : "Submit Report"}
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : reports && reports.length > 0 ? (
        <div className="grid gap-4">
          {reports.map((report) => {
            const status = statusConfig[report.status] || statusConfig.pending;
            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {report.weekNumber && (
                        <Badge variant="outline">Week {report.weekNumber}</Badge>
                      )}
                      <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
                      <Badge className={`gap-1 ${status.className}`}>
                        {status.icon}
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">
                      Submitted on {new Date(report.submittedAt).toLocaleDateString()}
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 mb-3">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.content}</p>
                    </div>
                    {report.feedback && (
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-800 mb-1">Supervisor Feedback:</p>
                        <p className="text-sm text-green-700">{report.feedback}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Reports Yet</h3>
            <p className="text-slate-500 mb-4">Start submitting your weekly logbook entries.</p>
            <Button onClick={() => setIsOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Submit First Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
