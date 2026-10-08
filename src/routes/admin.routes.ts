// const prefix = "/admin";

// export const adminRoutes = [
//    {
//       title: "Management",
//       items: [
//          {
//             title: "Overview",
//             url: `${prefix}`,
//          },
//          {
//             title: "All Users", // ← এই লাইনটা নতুন যোগ করুন
//             url: `${prefix}/users`,
//          },
//          {
//             title: "Instructor Applications",
//             url: `${prefix}/instructor-applications`,
//          },
//          {
//             title: "Departments",
//             url: `${prefix}/departments`,
//          },
//          {
//             title: "Programs",
//             url: `${prefix}/programs`,
//          },
//          {
//             title: "Courses",
//             url: `${prefix}/courses`,
//          },
//          {
//             title: "Semesters",
//             url: `${prefix}/semesters`,
//          },
//          {
//             title: "Sections",
//             url: `${prefix}/sections`,
//          },
//          {
//             title: "Registrations",
//             url: `${prefix}/registrations`,
//          },
//          { title: "Results", url: `${prefix}/results` },
//       ],
//    },
// ];

const prefix = "/admin";

export const adminRoutes = [
   {
      title: "Dashboard",
      items: [
         {
            title: "Overview",
            url: `${prefix}`,
         },
      ],
   },
   {
      title: "User Management",
      items: [
         {
            title: "All Users",
            url: `${prefix}/users`,
         },
         // {
         //    title: "Students",
         //    url: `${prefix}/students`,
         // },
         // {
         //    title: "Instructors",
         //    url: `${prefix}/instructors`,
         // },
         {
            title: "Instructor Applications",
            url: `${prefix}/instructor-applications`,
         },
      ],
   },
   {
      title: "Academic Management",
      items: [
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
   {
      title: "Academic Operations",
      items: [
         {
            title: "Registrations",
            url: `${prefix}/registrations`,
         },
         {
            title: "Results",
            url: `${prefix}/results`,
         },
      ],
   },
   {
      title: "Finance",
      items: [
         {
            title: "Payments",
            url: `${prefix}/payments`,
         },
      ],
   },
];
