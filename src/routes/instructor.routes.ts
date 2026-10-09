const prefix = "/instructor";

export const instructorRoutes = [
   {
      title: "Dashboard",
      items: [
         {
            title: "Overview",
            url: `${prefix}`,
         },
         {
            title: "My Courses",
            url: `${prefix}/courses`,
         },
         {
            title: "My Sections",
            url: `${prefix}/sections`,
         },
      ],
   },
   {
      title: "Academic",
      items: [
         {
            title: "Results",
            url: `${prefix}/results`,
         },
      ],
   },
   {
      title: "Account",
      items: [
         {
            title: "My Profile",
            url: `${prefix}/profile`,
         },
      ],
   },
];
