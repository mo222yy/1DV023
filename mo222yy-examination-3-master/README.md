# mo222yy-examination-3

### What is the URL to your application?

https://cscloud115.lnu.se/

### Describe what you have done to make your application secure, both in code and when configuring your application server

**Code:** 
I’m using handlebars that validates and sanitizes input to the application and I have 	implemented the helmet.js module with content security policy.This is what I have done to 	protect the application against XSS attacks. Since I don’t make use of any sessions in the 	application I had no need to implement protections against CSRF attacks.

I have generated a personal access token to authenticate my calls to GitHub and I have 	defined a secret to validate that my webhook POST requests really comes from GitHub.
Both theese are stored in a .env file so I don’t expose them publically.

**Server:**
My server is using a reversed proxy that only listens to port 80 and 443.
All requests to port 80 are redirected to 443 ie, it’s only using HTTPS.
This was possible by the certificate I created through LetsEncrypt


### Describe the following parts, how you are using them and what their purpose is in your solution:

**Reversed proxy**

I’m using the reversed proxy in front of my application, it redirects all http requests to https and it forwards the requests to port 3000. It also acts as an additional defense since it protects the backend servers identity.

**Process manager**

I’m only using this to run the application on the server. It also restarts the 		application automatically when it has crashed

**TLS certificates**

I have created a certificate through Let’s encrypt. This was done by installing 	certbot on my server which then generates keys which I then uses in my Nginx 	configuration for this domain. The purpose of this is to make https available

**Environment variables**

In the code I’m using environment variables for the sensitive data, the github 	personal access token and the secret for the webhook. The reason for this is to not 	expose them to the public.
On the server i have set a global variable NODE_ENV=production since it’s a 	production server.




### What differs in your application when running it in development from running it in production?

The only difference in my application is the standard differences,
Logging is kept to a minimum, essential level and more caching levels take place to optimize performance.

### Which extra modules did you use in the assignment? Motivate the use of them and how you have make sure that they are secure enough for production

**Body-parser:** parse incoming request bodies.

**Dateformat:** give the dates a nice layout in a easy way.

**Dotenv:** read environment variables

**Helmet:** protection against XSS attacks

**Octonode:** helps with the github API calls

**Socket.io:** to enable real-time, event-based communication between my github webhook and the server.

**Express-github-webhook:** to validate and handle webhooks from the selected repo.

The things I did to check their security was to check the number of downloads. All of them except express-github-webhook and octonde had more than a million weekly downloads which indicates that they should be secure. For octonode I just went with it by your recommendation. I also ran npm audit to check for vulnerabilities.

### Have you implemented any extra features (see below) that could motivate a higher grade of this assignment? If so, describe them.
No...
