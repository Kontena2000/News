import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MultiAgentWorkflow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Agent News Research Workflow</CardTitle>
        <CardDescription>
          How our AI agents collaborate to research and produce comprehensive news articles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Simplified version of the multi-agent workflow visualization</p>
      </CardContent>
    </Card>
  );
}

// Alternative export style if the above doesn't work
// const MultiAgentWorkflow = () => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Multi-Agent News Research Workflow</CardTitle>
//         <CardDescription>
//           How our AI agents collaborate to research and produce comprehensive news articles
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>Simplified version of the multi-agent workflow visualization</p>
//       </CardContent>
//     </Card>
//   );
// };
// 
// export { MultiAgentWorkflow };