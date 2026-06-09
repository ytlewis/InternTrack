import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import {
  GraduationCap,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Star,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router";

export default function SupervisorStudentDetail() {
  const { id } = useParams<{ id: string }>();
  const placementId = parseInt(id || "0");

  const utils = trpc.useUtils();
  const { data: placement, isLoading } = trpc.placement.byId.useQuery(
    { id: placementId },
    { enabled: placementId > 0 }
  );

  const [feedbackText, setFeedbackText] = useState<Record<number, string>>({});

  const feedbackMutation = trpc.report.feedback.useMutation({
    onSuccess: () => {
      toast.success("Feedback submitted!");
      utils.placement.byId.invalidate({ id: placementId });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleFeedback = (reportId: number, status: "approved" | "rejected") => {
    const feedback = feedbackText[reportId] || "";
    feedbackMutation.mutate({ id: reportId, feedback, status });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!placement) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Placement not found.</p>
      </div>
    );
  }

  const student = placement.application.student;
  const opportunity = placement.application.opportunity;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/supervisor/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{student.user.name}</h1>
          <p className="text-slate-500">{student.studentId} · {opportunity.title}</p>
        </div>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Program</p>
                <p className="font-medium text-slate-900">{student.program}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Company</p>
                <p className="font-medium text-slate-900">{opportunity.employer.companyName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Duration</p>
                <p className="font-medium text-slate-900">
                  {placement.startDate ? new Date(placement.startDate).toLocaleDateString() : "Not set"} -
                  {placement.endDate ? new Date(placement.endDate).toLocaleDateString() : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Submitted Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {placement.reports.length > 0 ? (
            <div className="space-y-4">
              {placement.reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {report.weekNumber && <Badge variant="outline">Week {report.weekNumber}</Badge>}
                    <h4 className="font-semibold text-slate-900">{report.title}</h4>
                    <Badge className={
                      report.status === "approved" ? "bg-green-100 text-green-700" :
                      report.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">
                    Submitted {new Date(report.submittedAt).toLocaleDateString()}
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.content}</p>
                  </div>

                  {report.status === "pending" && (
                    <div className="space-y-2">
                      <Label>Your Feedback</Label>
                      <Textarea
                        placeholder="Provide feedback on this report..."
                        value={feedbackText[report.id] || ""}
                        onChange={(e) => setFeedbackText((prev) => ({ ...prev, [report.id]: e.target.value }))}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleFeedback(report.id, "approved")}
                          disabled={feedbackMutation.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleFeedback(report.id, "rejected")}
                          disabled={feedbackMutation.isPending}
                        >
                          <XCircle className="w-4 h-4" />
                          Request Revision
                        </Button>
                      </div>
                    </div>
                  )}

                  {report.feedback && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 mt-2">
                      <p className="text-sm font-medium text-green-800">Your Feedback:</p>
                      <p className="text-sm text-green-700">{report.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No reports submitted yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evaluations */}
      {placement.evaluations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Evaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {placement.evaluations.map((evalItem) => (
                <div key={evalItem.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < evalItem.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant="outline" className="capitalize">{evalItem.evaluatorRole}</Badge>
                  <span className="text-sm text-slate-500">{evalItem.comments}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
