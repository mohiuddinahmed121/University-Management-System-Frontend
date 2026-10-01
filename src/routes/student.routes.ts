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
         {
            title: "Transcript",
            url: `${prefix}/transcript`,
         },
      ],
   },
   {
      title: "Registration",
      items: [
         {
            title: "Course Registration",
            url: `${prefix}/registration`,
         },
      ],
   },
];
