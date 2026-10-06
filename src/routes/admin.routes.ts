const prefix = "/admin";

export const adminRoutes = [
   {
      title: "Management",
      items: [
         {
            title: "Overview",
            url: `${prefix}`,
         },
         {
            title: "All Users", // ← এই লাইনটা নতুন যোগ করুন
            url: `${prefix}/users`,
         },
         {
            title: "Instructor Applications",
            url: `${prefix}/instructor-applications`,
         },
         {
            title: "Departments",
            url: `${prefix}/departments`,
         },
         {
            title: "Programs",
            url: `${prefix}/programs`,
         },
         {
            title: "Courses",
            url: `${prefix}/courses`,
         },
         {
            title: "Semesters",
            url: `${prefix}/semesters`,
         },
         {
            title: "Sections",
            url: `${prefix}/sections`,
         },
      ],
   },
];
