// "use client";

// import { useGetSingleStudentProfile } from "@/hooks";
// import { useParams } from "next/navigation";

// export default function SingleStudentPage() {
//    const params = useParams();
//    const studentId = params.id as string;

//    const { data: student, isLoading, isError } = useGetSingleStudentProfile(studentId);

//    if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
//    if (isError || !student) return <p className="p-6 text-sm text-red-500">Student not found.</p>;

//    return (
//       <div className="p-6">
//          <h1 className="mb-6 text-2xl font-semibold">Student Profile</h1>

//          <div className="max-w-xl rounded-md border p-6">
//             <dl className="divide-y">
//                <div className="grid grid-cols-2 gap-4 py-3">
//                   <dt className="text-sm text-muted-foreground">Student ID</dt>
//                   <dd className="text-sm font-medium">{student.studentId}</dd>
//                </div>
//                <div className="grid grid-cols-2 gap-4 py-3">
//                   <dt className="text-sm text-muted-foreground">Name</dt>
//                   <dd className="text-sm font-medium">{student.name}</dd>
//                </div>
//                <div className="grid grid-cols-2 gap-4 py-3">
//                   <dt className="text-sm text-muted-foreground">Email</dt>
//                   <dd className="text-sm font-medium">{student.email}</dd>
//                </div>
//                <div className="grid grid-cols-2 gap-4 py-3">
//                   <dt className="text-sm text-muted-foreground">Phone</dt>
//                   <dd className="text-sm font-medium">{student.phone ?? "-"}</dd>
//                </div>
//                <div className="grid grid-cols-2 gap-4 py-3">
//                   <dt className="text-sm text-muted-foreground">Program</dt>
//                   <dd className="text-sm font-medium">{student.program.name}</dd>
//                </div>
//                <div className="grid grid-cols-2 gap-4 py-3">
//                   <dt className="text-sm text-muted-foreground">Department</dt>
//                   <dd className="text-sm font-medium">{student.program.department.name}</dd>
//                </div>
//                <div className="grid grid-cols-2 gap-4 py-3">
//                   <dt className="text-sm text-muted-foreground">Account Status</dt>
//                   <dd className="text-sm font-medium">{student.user.status ?? "-"}</dd>
//                </div>
//             </dl>
//          </div>
//       </div>
//    );
// }
