import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  CheckSquare,
  Star,
  GraduationCap,
  Send,
  Plus,
} from "lucide-react";

export default function SupervisorEvaluations() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: placements, isLoading } = trpc.placement.listBySupervisor.useQuery(
    { supervisorUserId: user?.id || 0 },
    { enabled: !!user?.id && user?.role === "supervisor" }
  );

  const [selectedPlacement, setSelectedPlacement] = useState<number | null>(null);
  const [rating, setRating] = useState("5");
  const [comments, setComments] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const createEval = trpc.evaluation.create.useMutation({
    onSuccess: () => {
      toast.success("Evaluation submitted!");
      setIsOpen(false);
      setRating("5");
      setComments("");
      setSelectedPlacement(null);
      utils.placement.listBySupervisor.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = () => {
    if (!selectedPlacement || !user) return;
    createEval.mutate({
      placementId: selectedPlacement,
      evaluatorRole: "supervisor",
      evaluatorId: user.id,
      rating: parseInt(rating),
      comments: comments || undefined,
    });
  };

  const activePlacements = placements?.filter((p) => p.status === "active") || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Evaluations</h1>
          <p className="text-slate-500">Submit evaluations for your assigned students</p>
        </div>
        {activePlacements.length > 0 && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Evaluation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit Evaluation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select value={selectedPlacement?.toString() || ""} onValueChange={(v) => setSelectedPlacement(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activePlacements.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.application.student.user.name} - {p.application.opportunity.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <SelectItem key={r} value={r.toString()}>
                          {r} {r === 1 ? "star" : "stars"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Comments</Label>
                  <Textarea
                    placeholder="Provide detailed feedback about the student's performance..."
                    rows={5}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={handleSubmit}
                  disabled={!selectedPlacement || createEval.isPending}
                >
                  {createEval.isPending ? "Submitting..." : "Submit Evaluation"}
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Existing Evaluations */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : placements && placements.length > 0 ? (
        <div className="space-y-4">
          {placements.map((placement) =>
            placement.evaluations.map((evalItem) => (
              <Card key={evalItem.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <CheckSquare className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {placement.application.student.user.name}
                      </h3>
                      <p className="text-sm text-slate-500 mb-2">
                        {placement.application.opportunity.title} at {placement.application.opportunity.employer.companyName}
                      </p>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < evalItem.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-slate-500 ml-2">{evalItem.rating}/5</span>
                      </div>
                      {evalItem.comments && (
                        <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                          {evalItem.comments}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {placements.every((p) => p.evaluations.length === 0) && (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Evaluations Yet</h3>
                <p className="text-slate-500">Submit your first evaluation using the button above.</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Students Assigned</h3>
            <p className="text-slate-500">You don&apos;t have any students to evaluate yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
