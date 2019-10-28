# Parrot
> a meeting transcription service

## Installation
```shell script
npm install
```
## Environment Variables
### Set up keys for Microsoft Graph API
1. Register an Outlook email. This will be the email to receive meeting invitations.

2. Rename `.env.example` to `.env`.

3. Get **OUTLOOK_CLIENT_ID** and **OUTLOOK_CLIENT_SECRETE**.
    1. Open a browser and navigate to the [Azure Active Directory](https://aad.portal.azure.com) admin center. Login using the Outlook email (aka: Microsoft Account).
    2. Select **Azure Active Directory** in the left-hand navigation, then select **App registrations** (Preview) under Manage.
    3. Select **New registration**. On the Register an application page, set the values as follows.
        - Set a **Name**.
        - Set **Supported account types** to **Accounts in any organizational directory and personal Microsoft accounts**.
        - Under **Redirect URI**, set the first drop-down to Web and set the value to `[Your server address]/authorize`(You can use `http://localhost:3000/authorize` for local testing). Also, save this redirect URI to **OUTLOOK_REDIRECT_URI** in `.env`.
    4. Choose **Register**. On your application page, copy **Application (client) ID** and paste it to **OUTLOOK_CLIENT_ID** in the `.env` File.
    5. Select **Authentication** under **Manage**. Locate the **Implicit grant** section and enable **ID tokens**. Choose **Save**.
    6. Select **Certificates & secrets** under **Manage**. Select the **New client secret** button. Enter a value in **Description** and select one of the options for **Expires** and choose **Add**.
    7. Copy the client secret value and save it to **OUTLOOK_CLIENT_SECRETE** in `.env`.

4. If you are using a live server, you can skip this step. Microsoft Graph API needs a live address to send the change notifications. You can use [ngrok](https://ngrok.com/) to get a live address and tunnel the http requests to you local server. Download ngrok and run `ngrok http 3000`. It will give you a live web address looks like this:`https://e291b34f.ngrok.io`. Copy and paste this address to `SERVER_ADDRESS` in `.env`.

5. Go back to your console and run `npm start`. If this is the first time you run the server, a Microsoft OAuth page will be opened. Login with your Microsoft account. Wait for a couple of seconds. Your will be redirected to the authorize page, and the access token will be automatically saved to `.env`.

### Set up keys for Twillio
1. Register a Twilio account.

2. Create a project. Make sure to navigate to Products section and select the "Phone Numbers" option.

3. Once project is created, navigate to the project dashboard where there is a card that show the Account Sid and Auth Token required by this project to call Twilio API.

4. If not created yet, make a new file called .env in the root of the project. Add the Twilio Account Sid and Auth Token in that file as shown below:

```
TWILLIO_ACCOUNT_SID={YOUR_ACCOUNT_SID}
TWILLIO_AUTH_TOKEN={YOUR_AUTH_TOKEN)
```

### Setup keys for Google Speaker Diarization
1. Register for Google cloud using your Google account.
  1. In the GCP Console, go to the **Create service account key** page.
  2. From the **Service account** list, select **New service account**.
  3. In the **Service account name** field, enter a name.
  4. From the **Role** list, select **Project > Owner**.

    *Note: The Role field authorizes your service account to access resources. You can view and change this field later by using the GCP Console. If you are developing a production app, specify more granular permissions than Project > Owner. For more information, see granting roles to service accounts.*
  5. Click Create. A JSON file that contains your key downloads to your computer.

2. In order to use Google Could API. Follow steps on [Getting Started with Authentication](https://cloud.google.com/docs/authentication/getting-started?refresh=1&pli=1).

    1. Create a service account to get a JSON file that contains your keys.

    2. Provide authentication credentials to your application code by setting the environment variable **GOOGLE_APPLICATION_CREDENTIALS**. Replace **[PATH]** with the file path of the JSON file that contains your service account key, and **[FILE_NAME]** with the filename. This variable only applies to your current shell session, so if you open a new session, set the variable again.

    For Linux:
    ```
    export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"
    ```
    For Windows command prompt:
    ```
    set GOOGLE_APPLICATION_CREDENTIALS=[PATH]
    ```

## References
[Register a Microsoft Graph API app](https://docs.microsoft.com/en-us/outlook/rest/node-tutorial#register-the-app)
