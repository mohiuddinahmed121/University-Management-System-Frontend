const prefix = "/student";

export const studentRoutes = [
   {
      title: "Academic",
      items: [
         {
            title: "Overview",
            url: `${prefix}`,
         },
         {
            title: "Courses",
            url: `${prefix}/courses`,
         },
         {
            title: "My Courses",
            url: `${prefix}/my-courses`,
         },
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
         {
            title: "Payments",
            url: `${prefix}/payments`,
         },
      ],
   },
];
