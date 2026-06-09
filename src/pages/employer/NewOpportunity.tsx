import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Send,
} from "lucide-react";

export default function NewOpportunity() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [slotsAvailable, setSlotsAvailable] = useState("1");

  const createOpp = trpc.opportunity.create.useMutation({
    onSuccess: () => {
      toast.success("Opportunity posted! Awaiting admin approval.");
      utils.opportunity.listByEmployer.invalidate();
      navigate("/employer/opportunities");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }
    createOpp.mutate({
      title,
      description,
      requirements: requirements || undefined,
      location: location || undefined,
      duration: duration || undefined,
      slotsAvailable: parseInt(slotsAvailable) || 1,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/employer/opportunities")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Post New Opportunity</h1>
          <p className="text-slate-500">Create a new internship opportunity for students</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Software Developer Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the internship role, responsibilities, and what the student will learn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List required skills, qualifications, and experience..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Nairobi, Kenya"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Duration
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g., 3 months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slots" className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  Slots Available
                </Label>
                <Input
                  id="slots"
                  type="number"
                  min={1}
                  value={slotsAvailable}
                  onChange={(e) => setSlotsAvailable(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                className="gap-2"
                disabled={createOpp.isPending}
              >
                {createOpp.isPending ? "Submitting..." : "Post Opportunity"}
                <Send className="w-4 h-4" />
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/employer/opportunities")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
