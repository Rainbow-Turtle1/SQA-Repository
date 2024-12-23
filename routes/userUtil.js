export function createRedirectResponse(message, redirectUrl) {
   return `
     <html>
       <head>
         <style>
           body {
             font-family: Arial, sans-serif;
             display: flex;
             justify-content: center;
             align-items: center;
             height: 100vh;
             background-color: #f8d7da;
             color: #721c24;
             margin: 0;
           }
           .container {
             text-align: center;
             padding: 20px;
             border: 1px solid #f5c6cb;
             background-color: #f8d7da;
             border-radius: 5px;
           }
           p {
             margin: 0;
             font-size: 18px;
           }
         </style>
       </head>
       <body>
         <div class="container">
           <p>${message}</p>
         </div>
         <script>
           setTimeout(() => {
             window.location.href = '${redirectUrl}';
           }, 3000);
         </script>
       </body>
     </html>
   `;
 }