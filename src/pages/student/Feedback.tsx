import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MessageSquare,
  GraduationCap,
  BookOpen,
} from "lucide-react";

export default function StudentFeedback() {
  const { user } = useAuth();

  const { data: applications } = trpc.application.listByStudent.useQuery(
    { studentUserId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  const acceptedApp = applications?.find((a) => a.status === "accepted");

  const { data: evaluations, isLoading } = trpc.evaluation.listByPlacement.useQuery(
    { placementId: acceptedApp?.placement?.id || 0 },
    { enabled: !!acceptedApp?.placement?.id }
  );

  const { data: reports } = trpc.report.listByPlacement.useQuery(
    { placementId: acceptedApp?.placement?.id || 0 },
    { enabled: !!acceptedApp?.placement?.id }
  );

  const approvedReports = reports?.filter((r) => r.status === "approved") || [];

  if (!acceptedApp) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Feedback</h1>
          <p className="text-slate-500">View evaluations and feedback from your supervisors</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Internship</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              You need to be placed in an internship to receive feedback and evaluations.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Feedback</h1>
        <p className="text-slate-500">Evaluations and feedback for your internship</p>
      </div>

      {/* Internship Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{acceptedApp.opportunity.title}</h3>
              <p className="text-slate-600">{acceptedApp.opportunity.employer.companyName}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {approvedReports.length} reports approved
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {evaluations?.length || 0} evaluations received
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : evaluations && evaluations.length > 0 ? (
          evaluations.map((evalItem) => (
            <Card key={evalItem.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {evalItem.evaluatorRole === "supervisor" ? "Supervisor" : "Employer"} Evaluation
                      </h3>
                      <Badge variant="outline" className="capitalize">
                        {evalItem.evaluatorRole}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
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
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm text-slate-600">{evalItem.comments}</p>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-3">
                      Submitted on {new Date(evalItem.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Evaluations Yet</h3>
              <p className="text-slate-500">Your supervisor and employer will submit evaluations after reviewing your work.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Report Feedback Summary */}
      {reports && reports.filter((r) => r.feedback).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Report Feedback Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports
                .filter((r) => r.feedback)
                .map((report) => (
                  <div key={report.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{report.title}</p>
                      <p className="text-sm text-slate-600">{report.feedback}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
