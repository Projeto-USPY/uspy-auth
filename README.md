# USPY 🕵️ - Auth

This is the official repository for the [USPY](https://uspy.me) Auth service! Here you can find how to run the application youself and some brief explanation on the code repository.

&nbsp;

## What does it do?

---

USPY used to handle signup by leveraging ID digital's manual captcha.
That way the user would do the hard work of solving the captcha and allowing the backend to retrieve the users' PDF grades, parse it and do other business logic related to account creation

Nowadays, ID Digital is protected by ReCaptcha, so this service is required to do that middle ground.

&nbsp;

## Running

---

### Node 16 is required to run this project. A personal recommendation is to install it through [nvm](https://github.com/nvm-sh/nvm)

&nbsp;

### **1. Install required modules**

```
npm install
```

### **2. Cache puppeteer in the local directory**

```
npm run gcp-build
```

P.S. you may skip this step by simply removing `.puppeteerrc.cjs`. This file is needed when running in the cloud, since GCP requires puppeteer to specify cache location. This is explained in [puppeteer's official documentation](https://pptr.dev/#installation)

### **3. Run**

```
npm run start
```

This spins up the Cloud Functions Local Framework. Allowing you to fetch PDFs by performing a simple GET request like so:

```
curl localhost:8080/ABCDEFGHIJKL
```

### P.S.: The code **must** only contain alphanumerical characters (do not input hyphens `-`)!
