# Overview

Privy's wallet system supports granular controls on who can access wallets and what actions different users can perform.

To enforce these controls, Privy's API must verify the identity of the party requesting a wallet action, ensuring that only authorized actions are executed by the system. This process is known as **authentication**.

Privy supports both **user authentication** and **API authentication** for authenticating access to wallets.

***

## User authentication

Privy is a powerful toolkit for progressive authentication of users. With fine-grained control over onboarding flows and wallet connections, you can improve conversion and craft better UX.

Your app can authenticate users across web2 and web3 accounts, using either your existing authentication provider or Privy's authentication system.

### Using Privy as your authentication provider

If your app doesn't have an existing authentication provider, or would like a single provider for authentication and embedded wallets, you can use Privy's authentication system, which supports both web2 and web3 accounts.

Privy's client-side SDKs offers a variety of authentication methods, including email, SMS, passkey, socials (Google, Apple, Twitter, Farcaster, etc.), any OAuth system, and Ethereum and Solana wallets.

You can also associate multiple authentication methods with a user, allowing them to login to the same account and access the same wallet with whichever method they choose.

### Using your own authentication provider

If your app already has an authentication provider, Privy integrates with your app's [existing authentication system](/authentication/user-authentication/jwt-based-auth/overview). This includes any OIDC compliant authentication system , including OAuth 2.0, Auth0, Firebase, AWS Cognito, and more.

You can integrate your existing authentication provider with Privy via the REST API or any of Privy's client-side SDKs.

***

## API authentication

With **API authentication**, Privy authenticates a request from your server directly using an **API secret**. This ensures that Privy only executes requests sent by your servers alone, and no other party.

In addition to the API secret, you can also configure **authorization keys** that control specific wallets, policies, and other resources. Any requests to use or update these resources require a signature from the corresponding authorization key. This allows you to enforce granular controls on all Privy resources.

***

## Get started

<CardGroup>
  <Card title="Login users with their email" icon="envelope" href="/authentication/user-authentication/login-methods/email">
    Authenticate users using just their email address and a one-time passcode.
  </Card>

  <Card title="Login with metamask" icon="wallet" href="/authentication/user-authentication/login-methods/wallet">
    Authenticate users with their externally owned Ethereum or Solana wallets.
  </Card>

  <Card title="Enable MFA" icon="key" href="/authentication/user-authentication/mfa">
    Add an extra layer of security to user accounts with multi-factor authentication.
  </Card>

  <Card title="Seamless Farcaster Mini App login" icon="frame" href="/recipes/farcaster/mini-apps">
    Allow your users to sign into your Farcaster Mini App seamlessly with Privy.
  </Card>
</CardGroup>



# Using Privy as your authentication provider

Privy offers a variety of authentication methods, including:

* **[Email](/authentication/user-authentication/login-methods/email) or [SMS](/authentication/user-authentication/login-methods/sms)**: Passwordless login via a one-time passcode sent to a user's email address or phone number.
* **[Passkey](/authentication/user-authentication/login-methods/passkey)**: Biometric or passkey-based login based on the WebAuthn standard.
* **[OAuth and socials](/authentication/user-authentication/login-methods/oauth)**: Social login with Google, Apple, Twitter, Discord, GitHub, LinkedIn, Spotify, Telegram, Farcaster, and more.
* **[Wallets](/authentication/user-authentication/login-methods/wallet)**: External wallet login via Sign-In With Ethereum and Sign-In With Solana.

Your app can configure each of the account types above to be an upfront login method, or as an account that users link to their profile after login.

Privy also supports [MFA](/authentication/user-authentication/mfa/overview) for taking actions on wallets, enhancing the security of your users' accounts for higher-value transactions.

All of Privy's authentication methods create a common [user object](/user-management/users/the-user-object), where you can easily find a user's unique ID and all of the accounts they've linked to their profile. A user is a user, regardless of whether they've connected with a wallet, email or Discord account.

Once a user of your application successfully authenticates with Privy, Privy issues an [access token](/authentication/user-authentication/access-tokens) for the user that you app can additionally use to represent an authenticated session or to make authenticated requests to your backend.


# Using Privy as your authentication provider

Privy offers a variety of authentication methods, including:

* **[Email](/authentication/user-authentication/login-methods/email) or [SMS](/authentication/user-authentication/login-methods/sms)**: Passwordless login via a one-time passcode sent to a user's email address or phone number.
* **[Passkey](/authentication/user-authentication/login-methods/passkey)**: Biometric or passkey-based login based on the WebAuthn standard.
* **[OAuth and socials](/authentication/user-authentication/login-methods/oauth)**: Social login with Google, Apple, Twitter, Discord, GitHub, LinkedIn, Spotify, Telegram, Farcaster, and more.
* **[Wallets](/authentication/user-authentication/login-methods/wallet)**: External wallet login via Sign-In With Ethereum and Sign-In With Solana.

Your app can configure each of the account types above to be an upfront login method, or as an account that users link to their profile after login.

Privy also supports [MFA](/authentication/user-authentication/mfa/overview) for taking actions on wallets, enhancing the security of your users' accounts for higher-value transactions.

All of Privy's authentication methods create a common [user object](/user-management/users/the-user-object), where you can easily find a user's unique ID and all of the accounts they've linked to their profile. A user is a user, regardless of whether they've connected with a wallet, email or Discord account.

Once a user of your application successfully authenticates with Privy, Privy issues an [access token](/authentication/user-authentication/access-tokens) for the user that you app can additionally use to represent an authenticated session or to make authenticated requests to your backend.


# UI components

Privy supports easy onboarding with an out-of-the-box user interface to log users in.

The fastest way to integrate Privy is with the Privy login modal. Your application can integrate this modal in just a few lines of code and easily toggle on login methods for your application in the Privy dashboard.

You can also design your own login UIs, and integrate with Privy's authentication APIs to offer a login experience that feels seamless within your application.

<img src="https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=73a585da38b0eae634f6446982028b74" alt="images/Onboard.png" width="1843" height="1317" data-path="images/Onboard.png" srcset="https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=280&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=a0181bc0854c3c81409ca325f82ae997 280w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=560&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=d21a8d48921fbd16ee8bab7ab5fbc905 560w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=840&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=8162f91ae65032eb2584b4127ac9afb4 840w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=1100&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=952ae4c1d5ecb7dec7f6b88a35c9c4af 1100w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=1650&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=66c54a8e3f6aadd2241f0ed5a0f3d7b8 1650w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=2500&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=559b2d8255c227df7ad73f02e5ed4e35 2500w" data-optimize="true" data-opv="2" />

<Info>
  [Configure your login methods](/basics/get-started/dashboard/configure-login-methods) in the Privy
  Dashboard before using the UI components.
</Info>

<Tabs>
  <Tab title="React">
    <Tip>
      Privy's UIs are highly-customizable to seamlessly match the branding and design system of your
      app. Learn more about [customizing the login modal](/basics/react/advanced/configuring-appearance).
    </Tip>

    To have users login to your app with Privy's UIs, use the `login` method from the `useLogin` hook.

    ```tsx
    login: ({ loginMethods: PrivyClientConfig['loginMethods'], prefill?: { type: 'email' | 'phone', value: string }, disableSignup?: boolean, walletChainType?: 'ethereum-only' | 'solana-only' | 'ethereum-or-solana' }) => PrivyUser;
    ```

    ### Usage

    ```tsx
    import { useLogin, usePrivy } from '@privy-io/react-auth';

    function LoginButton() {
        const { ready, authenticated} = usePrivy();
        const { login } = useLogin();
        // Disable login when Privy is not ready or the user is already authenticated
        const disableLogin = !ready || (ready && authenticated);

        return (
            <button disabled={disableLogin} onClick={login}>
                Log in
            </button>
        );
    }
    ```

    ### Parameters

    <ParamField path="loginMethods" type="PrivyClientConfig['loginMethods']">
      Optionally specify which login methods to display in the modal.

      <Expandable title="Login Methods">
        The following login methods are supported:

        <ul>
          <ParamField path="wallet" type="string" />

          <ParamField path="email" type="string" />

          <ParamField path="sms" type="string" />

          <ParamField path="google" type="string" />

          <ParamField path="twitter" type="string" />

          <ParamField path="discord" type="string" />

          <ParamField path="github" type="string" />

          <ParamField path="linkedin" type="string" />

          <ParamField path="spotify" type="string" />

          <ParamField path="instagram" type="string" />

          <ParamField path="tiktok" type="string" />

          <ParamField path="apple" type="string" />

          <ParamField path="farcaster" type="string" />

          <ParamField path="telegram" type="string" />

          <ParamField path="line" type="string" />

          <ParamField path="passkey" type="string" />
        </ul>
      </Expandable>
    </ParamField>

    <ParamField path="prefill" type="{ type: 'email' | 'phone', value: string }">
      Optionally pre-fill the login modal with the user's email or phone number.
    </ParamField>

    <ParamField path="disableSignup" type="boolean">
      Prevent users from signing up for your app. This is useful when you want to enforce that users can only log in with existing accounts.
    </ParamField>

    <ParamField path="walletChainType" type="'ethereum-only' | 'solana-only' | 'ethereum-or-solana'">
      Filter the login wallet options to only show wallets that support the specified chain type.
    </ParamField>

    ### Callbacks

    You can easily attach callbacks to the `login` method using the `useLogin` hook. This allows you to run custom logic when a user successfully logs in or when there's an error.

    ```tsx
    import { useLogin } from '@privy-io/react-auth';

    function LoginButton() {
        const { login } = useLogin({
            onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
                console.log('User logged in successfully', user);
                console.log('Is new user:', isNewUser);
                console.log('Was already authenticated:', wasAlreadyAuthenticated);
                console.log('Login method:', loginMethod);
                console.log('Login account:', loginAccount);
                // Navigate to dashboard, show welcome message, etc.
            },
            onError: (error) => {
                console.error('Login failed', error);
                // Show error message
            }
        });

        return <button onClick={login}>Log in</button>;
    }
    ```

    <ParamField path="onComplete" type="({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount }) => void">
      Callback that executes when a user completes authentication. If the user is already authenticated when the component mounts, this callback executes immediately. Otherwise, it executes after successful login.

      <Expandable title="Callback Parameters">
        <ParamField path="user" type="PrivyUser">The user object with DID, linked accounts, and more.</ParamField>
        <ParamField path="isNewUser" type="boolean">Whether this is the user's first login or a returning user.</ParamField>
        <ParamField path="wasAlreadyAuthenticated" type="boolean">Whether the user was already authenticated when the component mounted.</ParamField>
        <ParamField path="loginMethod" type="string | null">The authentication method used ('email', 'sms', 'siwe', 'apple', 'discord', 'github', 'google', 'linkedin', 'spotify', 'tiktok', 'twitter', 'farcaster', 'passkey', 'telegram', 'line') or null if already authenticated.</ParamField>
        <ParamField path="loginAccount" type="object">The account used for authentication with type ('wallet', 'email', 'phone', 'google\_oauth', 'twitter\_oauth', 'discord\_oauth', 'github\_oauth', 'spotify\_oauth', 'instagram\_oauth', 'tiktok\_oauth', 'linkedin\_oauth', 'apple\_oauth', 'line\_oauth', 'custom\_auth', 'farcaster', 'passkey').</ParamField>
      </Expandable>
    </ParamField>

    <ParamField path="onError" type="(error) => void">
      Callback that executes when there's an error during login or when the user exits the login flow.
    </ParamField>
  </Tab>

  <Tab title="React Native">
    <Tip>
      Make sure you have [properly configured PrivyElements](/basics/react-native/advanced/setup-privyelements) before using UI components for authentication.
    </Tip>

    <Info>
      Privy's UIs are highly-customizable to seamlessly match the branding and design system of your app. Learn more about [customizing the login modal](/basics/react-native/advanced/configuring-appearance).
    </Info>

    To have users login to your app with Privy's UIs, use the `login` method from the `useLogin` hook.

    ```javascript
    login: ({ loginMethods: LoginMethod[], appearance?: { logo?: string } }) => void;
    ```

    ### Usage

    ```tsx
    import { useLogin } from '@privy-io/expo/ui';

    function LoginButton() {
        const { login } = useLogin();

        return (
            <Button
                onPress={() => {
                    login({ loginMethods: ['email', 'sms']})
                        .then((session) => {
                            console.log('User logged in', session.user);
                        })
                }}
                title="Log in"
            />
        );
    }
    ```

    ### Parameters

    <ParamField path="loginMethods" type="LoginMethod[]">
      An array of login methods for your users to choose from. The supported methods are `'email'`, `'sms'`, `'discord'`, `'twitter'`, `'github'`, `'spotify'`, `'instagram'`, `'tiktok'`, `'linkedin'`, and `'apple'`.
    </ParamField>

    <ParamField path="appearance.logo" type="string">
      (Optional) a url for the logo shown in the Login Method selection step. Aspect ratio should be 2:1.
    </ParamField>

    ### Returns

    <ResponseField name="user" type="PrivyUser">
      The user that logged in, with all of their properties.
    </ResponseField>
  </Tab>
</Tabs>



# UI components

Privy supports easy onboarding with an out-of-the-box user interface to log users in.

The fastest way to integrate Privy is with the Privy login modal. Your application can integrate this modal in just a few lines of code and easily toggle on login methods for your application in the Privy dashboard.

You can also design your own login UIs, and integrate with Privy's authentication APIs to offer a login experience that feels seamless within your application.

<img src="https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=73a585da38b0eae634f6446982028b74" alt="images/Onboard.png" width="1843" height="1317" data-path="images/Onboard.png" srcset="https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=280&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=a0181bc0854c3c81409ca325f82ae997 280w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=560&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=d21a8d48921fbd16ee8bab7ab5fbc905 560w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=840&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=8162f91ae65032eb2584b4127ac9afb4 840w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=1100&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=952ae4c1d5ecb7dec7f6b88a35c9c4af 1100w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=1650&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=66c54a8e3f6aadd2241f0ed5a0f3d7b8 1650w, https://mintcdn.com/privy-c2af3412/YvGXGsI-T4KAqoan/images/Onboard.png?w=2500&fit=max&auto=format&n=YvGXGsI-T4KAqoan&q=85&s=559b2d8255c227df7ad73f02e5ed4e35 2500w" data-optimize="true" data-opv="2" />

<Info>
  [Configure your login methods](/basics/get-started/dashboard/configure-login-methods) in the Privy
  Dashboard before using the UI components.
</Info>

<Tabs>
  <Tab title="React">
    <Tip>
      Privy's UIs are highly-customizable to seamlessly match the branding and design system of your
      app. Learn more about [customizing the login modal](/basics/react/advanced/configuring-appearance).
    </Tip>

    To have users login to your app with Privy's UIs, use the `login` method from the `useLogin` hook.

    ```tsx
    login: ({ loginMethods: PrivyClientConfig['loginMethods'], prefill?: { type: 'email' | 'phone', value: string }, disableSignup?: boolean, walletChainType?: 'ethereum-only' | 'solana-only' | 'ethereum-or-solana' }) => PrivyUser;
    ```

    ### Usage

    ```tsx
    import { useLogin, usePrivy } from '@privy-io/react-auth';

    function LoginButton() {
        const { ready, authenticated} = usePrivy();
        const { login } = useLogin();
        // Disable login when Privy is not ready or the user is already authenticated
        const disableLogin = !ready || (ready && authenticated);

        return (
            <button disabled={disableLogin} onClick={login}>
                Log in
            </button>
        );
    }
    ```

    ### Parameters

    <ParamField path="loginMethods" type="PrivyClientConfig['loginMethods']">
      Optionally specify which login methods to display in the modal.

      <Expandable title="Login Methods">
        The following login methods are supported:

        <ul>
          <ParamField path="wallet" type="string" />

          <ParamField path="email" type="string" />

          <ParamField path="sms" type="string" />

          <ParamField path="google" type="string" />

          <ParamField path="twitter" type="string" />

          <ParamField path="discord" type="string" />

          <ParamField path="github" type="string" />

          <ParamField path="linkedin" type="string" />

          <ParamField path="spotify" type="string" />

          <ParamField path="instagram" type="string" />

          <ParamField path="tiktok" type="string" />

          <ParamField path="apple" type="string" />

          <ParamField path="farcaster" type="string" />

          <ParamField path="telegram" type="string" />

          <ParamField path="line" type="string" />

          <ParamField path="passkey" type="string" />
        </ul>
      </Expandable>
    </ParamField>

    <ParamField path="prefill" type="{ type: 'email' | 'phone', value: string }">
      Optionally pre-fill the login modal with the user's email or phone number.
    </ParamField>

    <ParamField path="disableSignup" type="boolean">
      Prevent users from signing up for your app. This is useful when you want to enforce that users can only log in with existing accounts.
    </ParamField>

    <ParamField path="walletChainType" type="'ethereum-only' | 'solana-only' | 'ethereum-or-solana'">
      Filter the login wallet options to only show wallets that support the specified chain type.
    </ParamField>

    ### Callbacks

    You can easily attach callbacks to the `login` method using the `useLogin` hook. This allows you to run custom logic when a user successfully logs in or when there's an error.

    ```tsx
    import { useLogin } from '@privy-io/react-auth';

    function LoginButton() {
        const { login } = useLogin({
            onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
                console.log('User logged in successfully', user);
                console.log('Is new user:', isNewUser);
                console.log('Was already authenticated:', wasAlreadyAuthenticated);
                console.log('Login method:', loginMethod);
                console.log('Login account:', loginAccount);
                // Navigate to dashboard, show welcome message, etc.
            },
            onError: (error) => {
                console.error('Login failed', error);
                // Show error message
            }
        });

        return <button onClick={login}>Log in</button>;
    }
    ```

    <ParamField path="onComplete" type="({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount }) => void">
      Callback that executes when a user completes authentication. If the user is already authenticated when the component mounts, this callback executes immediately. Otherwise, it executes after successful login.

      <Expandable title="Callback Parameters">
        <ParamField path="user" type="PrivyUser">The user object with DID, linked accounts, and more.</ParamField>
        <ParamField path="isNewUser" type="boolean">Whether this is the user's first login or a returning user.</ParamField>
        <ParamField path="wasAlreadyAuthenticated" type="boolean">Whether the user was already authenticated when the component mounted.</ParamField>
        <ParamField path="loginMethod" type="string | null">The authentication method used ('email', 'sms', 'siwe', 'apple', 'discord', 'github', 'google', 'linkedin', 'spotify', 'tiktok', 'twitter', 'farcaster', 'passkey', 'telegram', 'line') or null if already authenticated.</ParamField>
        <ParamField path="loginAccount" type="object">The account used for authentication with type ('wallet', 'email', 'phone', 'google\_oauth', 'twitter\_oauth', 'discord\_oauth', 'github\_oauth', 'spotify\_oauth', 'instagram\_oauth', 'tiktok\_oauth', 'linkedin\_oauth', 'apple\_oauth', 'line\_oauth', 'custom\_auth', 'farcaster', 'passkey').</ParamField>
      </Expandable>
    </ParamField>

    <ParamField path="onError" type="(error) => void">
      Callback that executes when there's an error during login or when the user exits the login flow.
    </ParamField>
  </Tab>

  <Tab title="React Native">
    <Tip>
      Make sure you have [properly configured PrivyElements](/basics/react-native/advanced/setup-privyelements) before using UI components for authentication.
    </Tip>

    <Info>
      Privy's UIs are highly-customizable to seamlessly match the branding and design system of your app. Learn more about [customizing the login modal](/basics/react-native/advanced/configuring-appearance).
    </Info>

    To have users login to your app with Privy's UIs, use the `login` method from the `useLogin` hook.

    ```javascript
    login: ({ loginMethods: LoginMethod[], appearance?: { logo?: string } }) => void;
    ```

    ### Usage

    ```tsx
    import { useLogin } from '@privy-io/expo/ui';

    function LoginButton() {
        const { login } = useLogin();

        return (
            <Button
                onPress={() => {
                    login({ loginMethods: ['email', 'sms']})
                        .then((session) => {
                            console.log('User logged in', session.user);
                        })
                }}
                title="Log in"
            />
        );
    }
    ```

    ### Parameters

    <ParamField path="loginMethods" type="LoginMethod[]">
      An array of login methods for your users to choose from. The supported methods are `'email'`, `'sms'`, `'discord'`, `'twitter'`, `'github'`, `'spotify'`, `'instagram'`, `'tiktok'`, `'linkedin'`, and `'apple'`.
    </ParamField>

    <ParamField path="appearance.logo" type="string">
      (Optional) a url for the logo shown in the Login Method selection step. Aspect ratio should be 2:1.
    </ParamField>

    ### Returns

    <ResponseField name="user" type="PrivyUser">
      The user that logged in, with all of their properties.
    </ResponseField>
  </Tab>
</Tabs>


# Access tokens

When a user logs in to your app and becomes **authenticated**, Privy issues the user an app **access token**. This token is signed by Privy and cannot be spoofed.

When your frontend makes a request to your backend, you should include the current user's access token in the request. This allows your server to determine whether the requesting user is truly authenticated or not.

<Note>
  Looking to access user data? Check out our [Identity
  tokens](/user-management/users/identity-tokens#identity-tokens).
</Note>

***

## Access token format

Privy access tokens are [JSON Web Tokens (JWT)](https://jwt.io/introduction), signed with the ES256 algorithm. These JWTs include certain information about the user in their claims, namely:

<Expandable title="properties">
  <ResponseField name="sid" type="string">
    The user's current session ID
  </ResponseField>

  <ResponseField name="sub" type="string">
    The user's Privy DID
  </ResponseField>

  <ResponseField name="iss" type="string">
    The token issuer, which should always be [privy.io](https://privy.io)
  </ResponseField>

  <ResponseField name="aud" type="string">
    Your Privy app ID
  </ResponseField>

  <ResponseField name="iat" type="number">
    The timestamp of when the JWT was issued
  </ResponseField>

  <ResponseField name="exp" type="number">
    The timestamp of when the JWT will expire and is no longer valid. This is generally 1 hour after
    the JWT was issued.
  </ResponseField>
</Expandable>

<Info>
  Read more about Privy's tokens and their security in our [security
  guide](/security/authentication/user-authentication).
</Info>

***

## Sending the access token

### Accessing the token from your client

To include the current user's access token in requests from your frontend to your backend, you'll first need to retrieve it, then send it appropriately.

<Tabs>
  <Tab title="React">
    You can get the current user's Privy token as a string using the **`getAccessToken`** method from the **`usePrivy`** hook. This method will also automatically refresh the user's access token if it is nearing expiration or has expired.

    ```tsx
    const { getAccessToken } = usePrivy();
    const accessToken = await getAccessToken();
    ```

    If you need to get a user's Privy token *outside* of Privy's React context, you can directly import the **`getAccessToken`** method:

    ```tsx
    import { getAccessToken } from '@privy-io/react-auth';

    const authToken = await getAccessToken();
    ```

    <Warning>
      When using direct imports, you must ensure **`PrivyProvider`** has rendered before invoking the method.
      Whenever possible, you should retrieve **`getAccessToken`** from the **`usePrivy`** hook.
    </Warning>
  </Tab>

  <Tab title="React Native">
    In React Native, you can use the `getAccessToken` method from the `PrivyClient` instance to retrieve the user's access token.

    ```tsx
    const privy = createPrivyClient({
      appId: '<your-privy-app-id>',
      clientId: '<your-privy-app-client-id>'
    });
    const accessToken = await privy.getAccessToken();
    ```
  </Tab>

  <Tab title="Swift">
    In Swift, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```swift
    // Check if user is authenticated
    guard let user = privy.user else {
      // If user is nil, user is not authenticated
      return
    }

    // Get the access token
    do {
      let accessToken = try await user.getAccessToken()
      print("Access token: \(accessToken)")
    } catch {
      // Handle error appropriately
    }
    ```
  </Tab>

  <Tab title="Android">
    In Android, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```kotlin
    // Check if user is authenticated
    val user = privy.user
    if (user != null) {

      // Get the access token
      val result: Result<String> = user.getAccessToken()

      // Handle the result with fold method
      result.fold(
          onSuccess = { accessToken ->
              println("Access token: $accessToken")
          },
          onFailure = { error ->
              // Handle error appropriately
          },
      )
    }
    ```
  </Tab>

  <Tab title="Flutter">
    In Flutter, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```dart
    // Check if user is authenticated
    final user = privy.user;
    if (user != null) {

      // Get the access token
      final result = await privy.user.getAccessToken();

      // Handle the result with fold method
      result.fold(
        onSuccess: (accessToken) {
          print('Access token: $accessToken');
        },
        onError: (error) {
          // Handle error appropriately
        },
      );
    }
    ```
  </Tab>

  <Tab title="Unity">
    In Unity, you can use the `GetAccessToken` method on the `PrivyUser` instance to retrieve the user's access token.

    ```csharp
    // User will be null if no user is authenticated
    PrivyUser user = PrivyManager.Instance.User;
    if (user != null) {
      string accessToken = await user.GetAccessToken();
      Debug.Log(accessToken);
    }
    ```
  </Tab>
</Tabs>

<Info>
  If your app is configured to use HTTP-only cookies (instead of the default local storage), the
  access token will automatically be included in the cookies for requests to the same domain. In
  this case, you don't need to manually include the token in the request headers.
</Info>

### Using the access token with popular libraries

When sending requests to your backend, here's how you can include the access token with different HTTP client libraries:

<Tabs>
  <Tab title="fetch">
    ```tsx
    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await fetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // For HTTP-only cookies approach
    const response = await fetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // This includes cookies automatically
      body: JSON.stringify(data)
    });
    ```
  </Tab>

  <Tab title="axios">
    ```tsx
    import axios from 'axios';

    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await axios({
      method: 'post',
      url: '<your-api-endpoint>',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: data
    });

    // For HTTP-only cookies approach
    const response = await axios({
      method: 'post',
      url: '<your-api-endpoint>',
      withCredentials: true, // This includes cookies automatically
      data: data
    });
    ```
  </Tab>

  <Tab title="ofetch">
    ```tsx
    import { ofetch } from 'ofetch';

    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await ofetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: data
    });

    // For HTTP-only cookies approach
    const response = await ofetch('<your-api-endpoint>', {
      method: 'POST',
      credentials: 'include', // This includes cookies automatically
      body: data
    });
    ```
  </Tab>
</Tabs>

***

## Getting the access token

### Accessing the token from your server

When your server receives a request, the location of the user's access token depends on whether your app uses **local storage** (the default) or **cookies** to manage user sessions.

<Expandable title="local storage setup">
  If you're using local storage for session management, the access token will be passed in the `Authorization` header of the request with the `Bearer` prefix. You can extract it like this:

  <Tabs>
    <Tab title="NodeJS">
      ```tsx
      // Example for Express.js
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      // Example for Next.js API route
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      // Example for Next.js App Router
      const accessToken = headers().get('authorization')?.replace('Bearer ', '');
      ```
    </Tab>

    <Tab title="Go">
      ```go
      // Example for Go
      accessToken := r.Header.Get("Authorization")
      accessToken = strings.Replace(accessToken, "Bearer ", "", 1)
      ```
    </Tab>

    <Tab title="Python">
      ```python
      # Example for Python
      accessToken = request.headers.get("Authorization")
      accessToken = accessToken.replace("Bearer ", "")
      ```
    </Tab>
  </Tabs>
</Expandable>

<Expandable title="cookie setup">
  If you're using HTTP-only cookies for session management, the access token will be automatically included in the `privy-token` cookie. You can extract it like this:

  <Tabs>
    <Tab title="NodeJS">
      ```tsx
      // Example for Express.js
      const accessToken = req.cookies['privy-token'];

      // Example for Next.js API route
      const accessToken = req.cookies['privy-token'];

      // Example for Next.js App Router
      const cookieStore = cookies();
      const accessToken = cookieStore.get('privy-token')?.value;
      ```
    </Tab>

    <Tab title="Go">
      ```go
      // Example for Go
      accessToken := r.Cookies["privy-token"]
      ```
    </Tab>

    <Tab title="Python">
      ```python
      # Example for Python
      accessToken = request.cookies.get("privy-token")
      ```
    </Tab>
  </Tabs>
</Expandable>

## Verifying the access token

Once you've obtained the user's access token from a request, you should verify the token against Privy's **verification key** for your app to confirm that the token was issued by Privy and the user referenced by the DID in the token is truly authenticated.

The access token is a standard [ES256](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1) [JWT](https://jwt.io) and the verification key is a standard [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) public key. You can verify the access token against the public key using the **`@privy-io/server-auth`** library or using a third-party library for managing tokens.

<Tabs>
  <Tab title="NodeJS">
    ### Using Privy SDK

    Pass the user's access token as a `string` to the **`PrivyClient`**'s **`verifyAuthToken`** method:

    ```tsx
    // `privy` refers to an instance of the `PrivyClient`
    try {
      const verifiedClaims = await privy.verifyAuthToken(authToken);
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`);
    }
    ```

    If the token is valid, **`verifyAuthToken`** will return an **`AuthTokenClaims`** object with additional information about the request, with the fields below:

    | Parameter    | Type     | Description                                                                   |
    | ------------ | -------- | ----------------------------------------------------------------------------- |
    | `appId`      | `string` | Your Privy app ID.                                                            |
    | `userId`     | `string` | The authenticated user's Privy DID. Use this to identify the requesting user. |
    | `issuer`     | `string` | This will always be `'privy.io'`.                                             |
    | `issuedAt`   | `string` | Timestamp for when the access token was signed by Privy.                      |
    | `expiration` | `string` | Timestamp for when the access token will expire.                              |
    | `sessionId`  | `string` | Unique identifier for the user's session.                                     |

    If the token is invalid, **`verifyAuthToken`** will throw an error and you should **not** consider the requesting user authorized. This generally occurs if the token has expired or is invalid (e.g. corresponds to a different app ID).

    <Tip>
      The Privy Client's `verifyAuthToken` method will make a request to Privy's API to fetch the verification key for your app. You can avoid this API request by copying your verification key from the **Configuration > App settings** page of the [**Dashboard**](https://dashboard.privy.io) and passing it as a second parameter to `verifyAuthToken`:

      ```ts
      const verifiedClaims = await privy.verifyAuthToken(
        authToken,
        'paste-your-verification-key-from-the-dashboard'
      );
      ```
    </Tip>

    ### Using JavaScript libraries

    You can also use common JavaScript libraries to verify tokens:

    <Tabs>
      <Tab title="jose">
        To start, install `jose`:

        ```sh
        npm i jose
        ```

        Then, load your Privy public key using [`jose.importSPKI`](https://github.com/panva/jose/blob/main/docs/functions/key_import.importSPKI.md):

        ```tsx
        const verificationKey = await jose.importSPKI(
          "insert-your-privy-verification-key",
          "ES256"
        );
        ```

        Lastly, using [`jose.jwtVerify`](https://github.com/panva/jose/blob/main/docs/functions/jwt_verify.jwtVerify.md), verify that the JWT is valid and was issued by Privy!

        ```tsx
        const accessToken = "insert-the-users-access-token";
        try {
          const payload = await jose.jwtVerify(accessToken, verificationKey, {
            issuer: "privy.io",
            audience: "insert-your-privy-app-id",
          });
          console.log(payload);
        } catch (error) {
          console.error(error);
        }
        ```

        If the JWT is valid, you can extract the JWT's claims from the [`payload`](https://github.com/panva/jose/blob/main/docs/interfaces/types.JWTPayload.md). For example, you can use `payload.sub` to get the user's Privy DID.

        If the JWT is invalid, this method will throw an error.
      </Tab>

      <Tab title="jsonwebtoken">
        To start, install `jsonwebtoken`:

        ```sh
        npm i jsonwebtoken
        ```

        Then, load your Privy public key as a string.

        ```tsx
        const verificationKey = "insert-your-privy-verification-key".replace(
          /\\n/g,
          "\n"
        );
        ```

        The `replace` operation above ensures that any instances of `'\n'` in the stringified public key are replaced with actual newlines, per the PEM-encoded format.

        Lastly, verify the JWT using [`jwt.verify`](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback):

        ```tsx
        const accessToken = 'insert-the-user-access-token-from-request';
        try {
          const decoded = jwt.verify(accessToken, verificationKey, {
            issuer: 'privy.io',
            audience: /* your Privy App ID */
          });
          console.log(decoded);
        } catch (error) {
          console.error(error);
        }
        ```

        If the JWT is valid, you can extract the JWT's claims from `decoded`. For example, you can use `decoded.sub` to get the user's Privy DID.

        If the JWT is invalid, this method will throw an error.
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="Go">
    For Go, the [`golang-jwt`](https://github.com/golang-jwt/jwt) library is a popular choice for token verification. To start, install the library:

    ```sh
    go get -u github.com/golang-jwt/jwt/v5
    ```

    Next, load your Privy verification key and app ID as strings:

    ```go
    verificationKey := "insert-your-privy-verification-key"
    appId := "insert-your-privy-app-id"
    ```

    Then, parse the claims from the JWT and verify that they are valid:

    ```go
    accessToken := "insert-the-users-access-token"

    // Defining a Go type for Privy JWTs
    type PrivyClaims struct {
      AppId      string `json:"aud,omitempty"`
      Expiration uint64 `json:"exp,omitempty"`
      Issuer     string `json:"iss,omitempty"`
      UserId     string `json:"sub,omitempty"`
    }

    // This method will be used to check the token's claims later
    func (c *PrivyClaims) Valid() error {
      if c.AppId != appId {
        return errors.New("aud claim must be your Privy App ID.")
      }
      if c.Issuer != "privy.io" {
        return errors.New("iss claim must be 'privy.io'")
      }
      if c.Expiration < uint64(time.Now().Unix()) {
        return errors.New("Token is expired.");
      }

      return nil
    }

    // This method will be used to load the verification key in the required format later
    func keyFunc(token *jwt.Token) (interface{}, error) {
      if token.Method.Alg() != "ES256" {
        return nil, fmt.Errorf("Unexpected JWT signing method=%v", token.Header["alg"])
      }
        // https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseECPublicKeyFromPEM
      return jwt.ParseECPublicKeyFromPEM([]byte(verificationKey)), nil
    }

    // Check the JWT signature and decode claims
    // https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseWithClaims
    token, err := jwt.ParseWithClaims(accessToken, &PrivyClaims{}, keyFunc)
    if err != nil {
        fmt.Println("JWT signature is invalid.")
    }

    // Parse the JWT claims into your custom struct
    privyClaim, ok := token.Claims.(*PrivyClaims)
    if !ok {
        fmt.Println("JWT does not have all the necessary claims.")
    }

    // Check the JWT claims
    err = Valid(privyClaim);
    if err {
        fmt.Printf("JWT claims are invalid, with error=%v.", err);
        fmt.Println();
    } else {
        fmt.Println("JWT is valid.")
        fmt.Printf("%v", privyClaim)
    }
    ```

    If the JWT is valid, you can access its claims, including the user's DID, from the `privyClaim` struct above.

    If the JWT is invalid, an error will be thrown.
  </Tab>

  <Tab title="Python">
    For Python, use the `verify_access_token` method to verify the access token and get the user's claims.

    ```python
    from privy import PrivyAPI

    client = PrivyAPI(app_id="your-privy-app-id", app_secret="your-privy-api-key")
    try:
        user = client.users.verify_access_token(access_token)
        print(user)
    except Exception as e:
        print(e)
    ```

    If the token is valid, **`verify_access_token`** will return an **`AccessTokenClaims`** object with additional information about the request, with the fields below:

    | Parameter    | Type     | Description                                                                   |
    | ------------ | -------- | ----------------------------------------------------------------------------- |
    | `app_id`     | `string` | Your Privy app ID.                                                            |
    | `user_id`    | `string` | The authenticated user's Privy DID. Use this to identify the requesting user. |
    | `issuer`     | `string` | This will always be `'privy.io'`.                                             |
    | `issued_at`  | `string` | Timestamp for when the access token was signed by Privy.                      |
    | `expiration` | `string` | Timestamp for when the access token will expire.                              |
    | `session_id` | `string` | Unique identifier for the user's session.                                     |

    If the token is invalid, **`verify_access_token`** will throw an exception and you should **not** consider the requesting user authorized. This generally occurs if the token has expired or is invalid (e.g. corresponds to a different app ID).

    <Tip>
      The Privy Client's `verify_access_token` method will make a request to Privy's API to fetch the verification key for your app. You can avoid this API request by copying your verification key from the **Configuration > App settings** page of the [**Dashboard**](https://dashboard.privy.io) and passing it as a second parameter to `verify_access_token`:

      ```python
      user = client.users.verify_access_token(
        access_token,
        'paste-your-verification-key-from-the-dashboard'
      )
      ```
    </Tip>
  </Tab>
</Tabs>

## Managing expired access tokens

A user's access token might expire while they are actively using your app. For example, if a user does not take action on an application for an extended period of time, the access token can become expired.

* **Handle invalid token errors**: In these scenarios, if a method returns with an **`'invalid auth token'`** error, we recommend calling the **`getAccessToken`** method with a time-based backoff until the user's access token is refreshed with an updated expiration time.
* **Return errors from backend**: If you receive an expired access token in your backend, return an error to your client, and as above, trigger **`getAccessToken`** in your client.
* **Handle failed refreshes**: If the user's access token cannot be refreshed, the user will be logged out.


# Access tokens

When a user logs in to your app and becomes **authenticated**, Privy issues the user an app **access token**. This token is signed by Privy and cannot be spoofed.

When your frontend makes a request to your backend, you should include the current user's access token in the request. This allows your server to determine whether the requesting user is truly authenticated or not.

<Note>
  Looking to access user data? Check out our [Identity
  tokens](/user-management/users/identity-tokens#identity-tokens).
</Note>

***

## Access token format

Privy access tokens are [JSON Web Tokens (JWT)](https://jwt.io/introduction), signed with the ES256 algorithm. These JWTs include certain information about the user in their claims, namely:

<Expandable title="properties">
  <ResponseField name="sid" type="string">
    The user's current session ID
  </ResponseField>

  <ResponseField name="sub" type="string">
    The user's Privy DID
  </ResponseField>

  <ResponseField name="iss" type="string">
    The token issuer, which should always be [privy.io](https://privy.io)
  </ResponseField>

  <ResponseField name="aud" type="string">
    Your Privy app ID
  </ResponseField>

  <ResponseField name="iat" type="number">
    The timestamp of when the JWT was issued
  </ResponseField>

  <ResponseField name="exp" type="number">
    The timestamp of when the JWT will expire and is no longer valid. This is generally 1 hour after
    the JWT was issued.
  </ResponseField>
</Expandable>

<Info>
  Read more about Privy's tokens and their security in our [security
  guide](/security/authentication/user-authentication).
</Info>

***

## Sending the access token

### Accessing the token from your client

To include the current user's access token in requests from your frontend to your backend, you'll first need to retrieve it, then send it appropriately.

<Tabs>
  <Tab title="React">
    You can get the current user's Privy token as a string using the **`getAccessToken`** method from the **`usePrivy`** hook. This method will also automatically refresh the user's access token if it is nearing expiration or has expired.

    ```tsx
    const { getAccessToken } = usePrivy();
    const accessToken = await getAccessToken();
    ```

    If you need to get a user's Privy token *outside* of Privy's React context, you can directly import the **`getAccessToken`** method:

    ```tsx
    import { getAccessToken } from '@privy-io/react-auth';

    const authToken = await getAccessToken();
    ```

    <Warning>
      When using direct imports, you must ensure **`PrivyProvider`** has rendered before invoking the method.
      Whenever possible, you should retrieve **`getAccessToken`** from the **`usePrivy`** hook.
    </Warning>
  </Tab>

  <Tab title="React Native">
    In React Native, you can use the `getAccessToken` method from the `PrivyClient` instance to retrieve the user's access token.

    ```tsx
    const privy = createPrivyClient({
      appId: '<your-privy-app-id>',
      clientId: '<your-privy-app-client-id>'
    });
    const accessToken = await privy.getAccessToken();
    ```
  </Tab>

  <Tab title="Swift">
    In Swift, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```swift
    // Check if user is authenticated
    guard let user = privy.user else {
      // If user is nil, user is not authenticated
      return
    }

    // Get the access token
    do {
      let accessToken = try await user.getAccessToken()
      print("Access token: \(accessToken)")
    } catch {
      // Handle error appropriately
    }
    ```
  </Tab>

  <Tab title="Android">
    In Android, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```kotlin
    // Check if user is authenticated
    val user = privy.user
    if (user != null) {

      // Get the access token
      val result: Result<String> = user.getAccessToken()

      // Handle the result with fold method
      result.fold(
          onSuccess = { accessToken ->
              println("Access token: $accessToken")
          },
          onFailure = { error ->
              // Handle error appropriately
          },
      )
    }
    ```
  </Tab>

  <Tab title="Flutter">
    In Flutter, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```dart
    // Check if user is authenticated
    final user = privy.user;
    if (user != null) {

      // Get the access token
      final result = await privy.user.getAccessToken();

      // Handle the result with fold method
      result.fold(
        onSuccess: (accessToken) {
          print('Access token: $accessToken');
        },
        onError: (error) {
          // Handle error appropriately
        },
      );
    }
    ```
  </Tab>

  <Tab title="Unity">
    In Unity, you can use the `GetAccessToken` method on the `PrivyUser` instance to retrieve the user's access token.

    ```csharp
    // User will be null if no user is authenticated
    PrivyUser user = PrivyManager.Instance.User;
    if (user != null) {
      string accessToken = await user.GetAccessToken();
      Debug.Log(accessToken);
    }
    ```
  </Tab>
</Tabs>

<Info>
  If your app is configured to use HTTP-only cookies (instead of the default local storage), the
  access token will automatically be included in the cookies for requests to the same domain. In
  this case, you don't need to manually include the token in the request headers.
</Info>

### Using the access token with popular libraries

When sending requests to your backend, here's how you can include the access token with different HTTP client libraries:

<Tabs>
  <Tab title="fetch">
    ```tsx
    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await fetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // For HTTP-only cookies approach
    const response = await fetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // This includes cookies automatically
      body: JSON.stringify(data)
    });
    ```
  </Tab>

  <Tab title="axios">
    ```tsx
    import axios from 'axios';

    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await axios({
      method: 'post',
      url: '<your-api-endpoint>',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: data
    });

    // For HTTP-only cookies approach
    const response = await axios({
      method: 'post',
      url: '<your-api-endpoint>',
      withCredentials: true, // This includes cookies automatically
      data: data
    });
    ```
  </Tab>

  <Tab title="ofetch">
    ```tsx
    import { ofetch } from 'ofetch';

    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await ofetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: data
    });

    // For HTTP-only cookies approach
    const response = await ofetch('<your-api-endpoint>', {
      method: 'POST',
      credentials: 'include', // This includes cookies automatically
      body: data
    });
    ```
  </Tab>
</Tabs>

***

## Getting the access token

### Accessing the token from your server

When your server receives a request, the location of the user's access token depends on whether your app uses **local storage** (the default) or **cookies** to manage user sessions.

<Expandable title="local storage setup">
  If you're using local storage for session management, the access token will be passed in the `Authorization` header of the request with the `Bearer` prefix. You can extract it like this:

  <Tabs>
    <Tab title="NodeJS">
      ```tsx
      // Example for Express.js
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      // Example for Next.js API route
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      // Example for Next.js App Router
      const accessToken = headers().get('authorization')?.replace('Bearer ', '');
      ```
    </Tab>

    <Tab title="Go">
      ```go
      // Example for Go
      accessToken := r.Header.Get("Authorization")
      accessToken = strings.Replace(accessToken, "Bearer ", "", 1)
      ```
    </Tab>

    <Tab title="Python">
      ```python
      # Example for Python
      accessToken = request.headers.get("Authorization")
      accessToken = accessToken.replace("Bearer ", "")
      ```
    </Tab>
  </Tabs>
</Expandable>

<Expandable title="cookie setup">
  If you're using HTTP-only cookies for session management, the access token will be automatically included in the `privy-token` cookie. You can extract it like this:

  <Tabs>
    <Tab title="NodeJS">
      ```tsx
      // Example for Express.js
      const accessToken = req.cookies['privy-token'];

      // Example for Next.js API route
      const accessToken = req.cookies['privy-token'];

      // Example for Next.js App Router
      const cookieStore = cookies();
      const accessToken = cookieStore.get('privy-token')?.value;
      ```
    </Tab>

    <Tab title="Go">
      ```go
      // Example for Go
      accessToken := r.Cookies["privy-token"]
      ```
    </Tab>

    <Tab title="Python">
      ```python
      # Example for Python
      accessToken = request.cookies.get("privy-token")
      ```
    </Tab>
  </Tabs>
</Expandable>

## Verifying the access token

Once you've obtained the user's access token from a request, you should verify the token against Privy's **verification key** for your app to confirm that the token was issued by Privy and the user referenced by the DID in the token is truly authenticated.

The access token is a standard [ES256](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1) [JWT](https://jwt.io) and the verification key is a standard [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) public key. You can verify the access token against the public key using the **`@privy-io/server-auth`** library or using a third-party library for managing tokens.

<Tabs>
  <Tab title="NodeJS">
    ### Using Privy SDK

    Pass the user's access token as a `string` to the **`PrivyClient`**'s **`verifyAuthToken`** method:

    ```tsx
    // `privy` refers to an instance of the `PrivyClient`
    try {
      const verifiedClaims = await privy.verifyAuthToken(authToken);
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`);
    }
    ```

    If the token is valid, **`verifyAuthToken`** will return an **`AuthTokenClaims`** object with additional information about the request, with the fields below:

    | Parameter    | Type     | Description                                                                   |
    | ------------ | -------- | ----------------------------------------------------------------------------- |
    | `appId`      | `string` | Your Privy app ID.                                                            |
    | `userId`     | `string` | The authenticated user's Privy DID. Use this to identify the requesting user. |
    | `issuer`     | `string` | This will always be `'privy.io'`.                                             |
    | `issuedAt`   | `string` | Timestamp for when the access token was signed by Privy.                      |
    | `expiration` | `string` | Timestamp for when the access token will expire.                              |
    | `sessionId`  | `string` | Unique identifier for the user's session.                                     |

    If the token is invalid, **`verifyAuthToken`** will throw an error and you should **not** consider the requesting user authorized. This generally occurs if the token has expired or is invalid (e.g. corresponds to a different app ID).

    <Tip>
      The Privy Client's `verifyAuthToken` method will make a request to Privy's API to fetch the verification key for your app. You can avoid this API request by copying your verification key from the **Configuration > App settings** page of the [**Dashboard**](https://dashboard.privy.io) and passing it as a second parameter to `verifyAuthToken`:

      ```ts
      const verifiedClaims = await privy.verifyAuthToken(
        authToken,
        'paste-your-verification-key-from-the-dashboard'
      );
      ```
    </Tip>

    ### Using JavaScript libraries

    You can also use common JavaScript libraries to verify tokens:

    <Tabs>
      <Tab title="jose">
        To start, install `jose`:

        ```sh
        npm i jose
        ```

        Then, load your Privy public key using [`jose.importSPKI`](https://github.com/panva/jose/blob/main/docs/functions/key_import.importSPKI.md):

        ```tsx
        const verificationKey = await jose.importSPKI(
          "insert-your-privy-verification-key",
          "ES256"
        );
        ```

        Lastly, using [`jose.jwtVerify`](https://github.com/panva/jose/blob/main/docs/functions/jwt_verify.jwtVerify.md), verify that the JWT is valid and was issued by Privy!

        ```tsx
        const accessToken = "insert-the-users-access-token";
        try {
          const payload = await jose.jwtVerify(accessToken, verificationKey, {
            issuer: "privy.io",
            audience: "insert-your-privy-app-id",
          });
          console.log(payload);
        } catch (error) {
          console.error(error);
        }
        ```

        If the JWT is valid, you can extract the JWT's claims from the [`payload`](https://github.com/panva/jose/blob/main/docs/interfaces/types.JWTPayload.md). For example, you can use `payload.sub` to get the user's Privy DID.

        If the JWT is invalid, this method will throw an error.
      </Tab>

      <Tab title="jsonwebtoken">
        To start, install `jsonwebtoken`:

        ```sh
        npm i jsonwebtoken
        ```

        Then, load your Privy public key as a string.

        ```tsx
        const verificationKey = "insert-your-privy-verification-key".replace(
          /\\n/g,
          "\n"
        );
        ```

        The `replace` operation above ensures that any instances of `'\n'` in the stringified public key are replaced with actual newlines, per the PEM-encoded format.

        Lastly, verify the JWT using [`jwt.verify`](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback):

        ```tsx
        const accessToken = 'insert-the-user-access-token-from-request';
        try {
          const decoded = jwt.verify(accessToken, verificationKey, {
            issuer: 'privy.io',
            audience: /* your Privy App ID */
          });
          console.log(decoded);
        } catch (error) {
          console.error(error);
        }
        ```

        If the JWT is valid, you can extract the JWT's claims from `decoded`. For example, you can use `decoded.sub` to get the user's Privy DID.

        If the JWT is invalid, this method will throw an error.
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="Go">
    For Go, the [`golang-jwt`](https://github.com/golang-jwt/jwt) library is a popular choice for token verification. To start, install the library:

    ```sh
    go get -u github.com/golang-jwt/jwt/v5
    ```

    Next, load your Privy verification key and app ID as strings:

    ```go
    verificationKey := "insert-your-privy-verification-key"
    appId := "insert-your-privy-app-id"
    ```

    Then, parse the claims from the JWT and verify that they are valid:

    ```go
    accessToken := "insert-the-users-access-token"

    // Defining a Go type for Privy JWTs
    type PrivyClaims struct {
      AppId      string `json:"aud,omitempty"`
      Expiration uint64 `json:"exp,omitempty"`
      Issuer     string `json:"iss,omitempty"`
      UserId     string `json:"sub,omitempty"`
    }

    // This method will be used to check the token's claims later
    func (c *PrivyClaims) Valid() error {
      if c.AppId != appId {
        return errors.New("aud claim must be your Privy App ID.")
      }
      if c.Issuer != "privy.io" {
        return errors.New("iss claim must be 'privy.io'")
      }
      if c.Expiration < uint64(time.Now().Unix()) {
        return errors.New("Token is expired.");
      }

      return nil
    }

    // This method will be used to load the verification key in the required format later
    func keyFunc(token *jwt.Token) (interface{}, error) {
      if token.Method.Alg() != "ES256" {
        return nil, fmt.Errorf("Unexpected JWT signing method=%v", token.Header["alg"])
      }
        // https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseECPublicKeyFromPEM
      return jwt.ParseECPublicKeyFromPEM([]byte(verificationKey)), nil
    }

    // Check the JWT signature and decode claims
    // https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseWithClaims
    token, err := jwt.ParseWithClaims(accessToken, &PrivyClaims{}, keyFunc)
    if err != nil {
        fmt.Println("JWT signature is invalid.")
    }

    // Parse the JWT claims into your custom struct
    privyClaim, ok := token.Claims.(*PrivyClaims)
    if !ok {
        fmt.Println("JWT does not have all the necessary claims.")
    }

    // Check the JWT claims
    err = Valid(privyClaim);
    if err {
        fmt.Printf("JWT claims are invalid, with error=%v.", err);
        fmt.Println();
    } else {
        fmt.Println("JWT is valid.")
        fmt.Printf("%v", privyClaim)
    }
    ```

    If the JWT is valid, you can access its claims, including the user's DID, from the `privyClaim` struct above.

    If the JWT is invalid, an error will be thrown.
  </Tab>

  <Tab title="Python">
    For Python, use the `verify_access_token` method to verify the access token and get the user's claims.

    ```python
    from privy import PrivyAPI

    client = PrivyAPI(app_id="your-privy-app-id", app_secret="your-privy-api-key")
    try:
        user = client.users.verify_access_token(access_token)
        print(user)
    except Exception as e:
        print(e)
    ```

    If the token is valid, **`verify_access_token`** will return an **`AccessTokenClaims`** object with additional information about the request, with the fields below:

    | Parameter    | Type     | Description                                                                   |
    | ------------ | -------- | ----------------------------------------------------------------------------- |
    | `app_id`     | `string` | Your Privy app ID.                                                            |
    | `user_id`    | `string` | The authenticated user's Privy DID. Use this to identify the requesting user. |
    | `issuer`     | `string` | This will always be `'privy.io'`.                                             |
    | `issued_at`  | `string` | Timestamp for when the access token was signed by Privy.                      |
    | `expiration` | `string` | Timestamp for when the access token will expire.                              |
    | `session_id` | `string` | Unique identifier for the user's session.                                     |

    If the token is invalid, **`verify_access_token`** will throw an exception and you should **not** consider the requesting user authorized. This generally occurs if the token has expired or is invalid (e.g. corresponds to a different app ID).

    <Tip>
      The Privy Client's `verify_access_token` method will make a request to Privy's API to fetch the verification key for your app. You can avoid this API request by copying your verification key from the **Configuration > App settings** page of the [**Dashboard**](https://dashboard.privy.io) and passing it as a second parameter to `verify_access_token`:

      ```python
      user = client.users.verify_access_token(
        access_token,
        'paste-your-verification-key-from-the-dashboard'
      )
      ```
    </Tip>
  </Tab>
</Tabs>

## Managing expired access tokens

A user's access token might expire while they are actively using your app. For example, if a user does not take action on an application for an extended period of time, the access token can become expired.

* **Handle invalid token errors**: In these scenarios, if a method returns with an **`'invalid auth token'`** error, we recommend calling the **`getAccessToken`** method with a time-based backoff until the user's access token is refreshed with an updated expiration time.
* **Return errors from backend**: If you receive an expired access token in your backend, return an error to your client, and as above, trigger **`getAccessToken`** in your client.
* **Handle failed refreshes**: If the user's access token cannot be refreshed, the user will be logged out.


# Access tokens

When a user logs in to your app and becomes **authenticated**, Privy issues the user an app **access token**. This token is signed by Privy and cannot be spoofed.

When your frontend makes a request to your backend, you should include the current user's access token in the request. This allows your server to determine whether the requesting user is truly authenticated or not.

<Note>
  Looking to access user data? Check out our [Identity
  tokens](/user-management/users/identity-tokens#identity-tokens).
</Note>

***

## Access token format

Privy access tokens are [JSON Web Tokens (JWT)](https://jwt.io/introduction), signed with the ES256 algorithm. These JWTs include certain information about the user in their claims, namely:

<Expandable title="properties">
  <ResponseField name="sid" type="string">
    The user's current session ID
  </ResponseField>

  <ResponseField name="sub" type="string">
    The user's Privy DID
  </ResponseField>

  <ResponseField name="iss" type="string">
    The token issuer, which should always be [privy.io](https://privy.io)
  </ResponseField>

  <ResponseField name="aud" type="string">
    Your Privy app ID
  </ResponseField>

  <ResponseField name="iat" type="number">
    The timestamp of when the JWT was issued
  </ResponseField>

  <ResponseField name="exp" type="number">
    The timestamp of when the JWT will expire and is no longer valid. This is generally 1 hour after
    the JWT was issued.
  </ResponseField>
</Expandable>

<Info>
  Read more about Privy's tokens and their security in our [security
  guide](/security/authentication/user-authentication).
</Info>

***

## Sending the access token

### Accessing the token from your client

To include the current user's access token in requests from your frontend to your backend, you'll first need to retrieve it, then send it appropriately.

<Tabs>
  <Tab title="React">
    You can get the current user's Privy token as a string using the **`getAccessToken`** method from the **`usePrivy`** hook. This method will also automatically refresh the user's access token if it is nearing expiration or has expired.

    ```tsx
    const { getAccessToken } = usePrivy();
    const accessToken = await getAccessToken();
    ```

    If you need to get a user's Privy token *outside* of Privy's React context, you can directly import the **`getAccessToken`** method:

    ```tsx
    import { getAccessToken } from '@privy-io/react-auth';

    const authToken = await getAccessToken();
    ```

    <Warning>
      When using direct imports, you must ensure **`PrivyProvider`** has rendered before invoking the method.
      Whenever possible, you should retrieve **`getAccessToken`** from the **`usePrivy`** hook.
    </Warning>
  </Tab>

  <Tab title="React Native">
    In React Native, you can use the `getAccessToken` method from the `PrivyClient` instance to retrieve the user's access token.

    ```tsx
    const privy = createPrivyClient({
      appId: '<your-privy-app-id>',
      clientId: '<your-privy-app-client-id>'
    });
    const accessToken = await privy.getAccessToken();
    ```
  </Tab>

  <Tab title="Swift">
    In Swift, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```swift
    // Check if user is authenticated
    guard let user = privy.user else {
      // If user is nil, user is not authenticated
      return
    }

    // Get the access token
    do {
      let accessToken = try await user.getAccessToken()
      print("Access token: \(accessToken)")
    } catch {
      // Handle error appropriately
    }
    ```
  </Tab>

  <Tab title="Android">
    In Android, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```kotlin
    // Check if user is authenticated
    val user = privy.user
    if (user != null) {

      // Get the access token
      val result: Result<String> = user.getAccessToken()

      // Handle the result with fold method
      result.fold(
          onSuccess = { accessToken ->
              println("Access token: $accessToken")
          },
          onFailure = { error ->
              // Handle error appropriately
          },
      )
    }
    ```
  </Tab>

  <Tab title="Flutter">
    In Flutter, you can use the `getAccessToken` method on the PrivyUser object to retrieve the user's access token.

    ```dart
    // Check if user is authenticated
    final user = privy.user;
    if (user != null) {

      // Get the access token
      final result = await privy.user.getAccessToken();

      // Handle the result with fold method
      result.fold(
        onSuccess: (accessToken) {
          print('Access token: $accessToken');
        },
        onError: (error) {
          // Handle error appropriately
        },
      );
    }
    ```
  </Tab>

  <Tab title="Unity">
    In Unity, you can use the `GetAccessToken` method on the `PrivyUser` instance to retrieve the user's access token.

    ```csharp
    // User will be null if no user is authenticated
    PrivyUser user = PrivyManager.Instance.User;
    if (user != null) {
      string accessToken = await user.GetAccessToken();
      Debug.Log(accessToken);
    }
    ```
  </Tab>
</Tabs>

<Info>
  If your app is configured to use HTTP-only cookies (instead of the default local storage), the
  access token will automatically be included in the cookies for requests to the same domain. In
  this case, you don't need to manually include the token in the request headers.
</Info>

### Using the access token with popular libraries

When sending requests to your backend, here's how you can include the access token with different HTTP client libraries:

<Tabs>
  <Tab title="fetch">
    ```tsx
    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await fetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // For HTTP-only cookies approach
    const response = await fetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // This includes cookies automatically
      body: JSON.stringify(data)
    });
    ```
  </Tab>

  <Tab title="axios">
    ```tsx
    import axios from 'axios';

    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await axios({
      method: 'post',
      url: '<your-api-endpoint>',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: data
    });

    // For HTTP-only cookies approach
    const response = await axios({
      method: 'post',
      url: '<your-api-endpoint>',
      withCredentials: true, // This includes cookies automatically
      data: data
    });
    ```
  </Tab>

  <Tab title="ofetch">
    ```tsx
    import { ofetch } from 'ofetch';

    // For bearer token approach (when using local storage)
    const accessToken = await getAccessToken();
    const response = await ofetch('<your-api-endpoint>', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: data
    });

    // For HTTP-only cookies approach
    const response = await ofetch('<your-api-endpoint>', {
      method: 'POST',
      credentials: 'include', // This includes cookies automatically
      body: data
    });
    ```
  </Tab>
</Tabs>

***

## Getting the access token

### Accessing the token from your server

When your server receives a request, the location of the user's access token depends on whether your app uses **local storage** (the default) or **cookies** to manage user sessions.

<Expandable title="local storage setup">
  If you're using local storage for session management, the access token will be passed in the `Authorization` header of the request with the `Bearer` prefix. You can extract it like this:

  <Tabs>
    <Tab title="NodeJS">
      ```tsx
      // Example for Express.js
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      // Example for Next.js API route
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      // Example for Next.js App Router
      const accessToken = headers().get('authorization')?.replace('Bearer ', '');
      ```
    </Tab>

    <Tab title="Go">
      ```go
      // Example for Go
      accessToken := r.Header.Get("Authorization")
      accessToken = strings.Replace(accessToken, "Bearer ", "", 1)
      ```
    </Tab>

    <Tab title="Python">
      ```python
      # Example for Python
      accessToken = request.headers.get("Authorization")
      accessToken = accessToken.replace("Bearer ", "")
      ```
    </Tab>
  </Tabs>
</Expandable>

<Expandable title="cookie setup">
  If you're using HTTP-only cookies for session management, the access token will be automatically included in the `privy-token` cookie. You can extract it like this:

  <Tabs>
    <Tab title="NodeJS">
      ```tsx
      // Example for Express.js
      const accessToken = req.cookies['privy-token'];

      // Example for Next.js API route
      const accessToken = req.cookies['privy-token'];

      // Example for Next.js App Router
      const cookieStore = cookies();
      const accessToken = cookieStore.get('privy-token')?.value;
      ```
    </Tab>

    <Tab title="Go">
      ```go
      // Example for Go
      accessToken := r.Cookies["privy-token"]
      ```
    </Tab>

    <Tab title="Python">
      ```python
      # Example for Python
      accessToken = request.cookies.get("privy-token")
      ```
    </Tab>
  </Tabs>
</Expandable>

## Verifying the access token

Once you've obtained the user's access token from a request, you should verify the token against Privy's **verification key** for your app to confirm that the token was issued by Privy and the user referenced by the DID in the token is truly authenticated.

The access token is a standard [ES256](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1) [JWT](https://jwt.io) and the verification key is a standard [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) public key. You can verify the access token against the public key using the **`@privy-io/server-auth`** library or using a third-party library for managing tokens.

<Tabs>
  <Tab title="NodeJS">
    ### Using Privy SDK

    Pass the user's access token as a `string` to the **`PrivyClient`**'s **`verifyAuthToken`** method:

    ```tsx
    // `privy` refers to an instance of the `PrivyClient`
    try {
      const verifiedClaims = await privy.verifyAuthToken(authToken);
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`);
    }
    ```

    If the token is valid, **`verifyAuthToken`** will return an **`AuthTokenClaims`** object with additional information about the request, with the fields below:

    | Parameter    | Type     | Description                                                                   |
    | ------------ | -------- | ----------------------------------------------------------------------------- |
    | `appId`      | `string` | Your Privy app ID.                                                            |
    | `userId`     | `string` | The authenticated user's Privy DID. Use this to identify the requesting user. |
    | `issuer`     | `string` | This will always be `'privy.io'`.                                             |
    | `issuedAt`   | `string` | Timestamp for when the access token was signed by Privy.                      |
    | `expiration` | `string` | Timestamp for when the access token will expire.                              |
    | `sessionId`  | `string` | Unique identifier for the user's session.                                     |

    If the token is invalid, **`verifyAuthToken`** will throw an error and you should **not** consider the requesting user authorized. This generally occurs if the token has expired or is invalid (e.g. corresponds to a different app ID).

    <Tip>
      The Privy Client's `verifyAuthToken` method will make a request to Privy's API to fetch the verification key for your app. You can avoid this API request by copying your verification key from the **Configuration > App settings** page of the [**Dashboard**](https://dashboard.privy.io) and passing it as a second parameter to `verifyAuthToken`:

      ```ts
      const verifiedClaims = await privy.verifyAuthToken(
        authToken,
        'paste-your-verification-key-from-the-dashboard'
      );
      ```
    </Tip>

    ### Using JavaScript libraries

    You can also use common JavaScript libraries to verify tokens:

    <Tabs>
      <Tab title="jose">
        To start, install `jose`:

        ```sh
        npm i jose
        ```

        Then, load your Privy public key using [`jose.importSPKI`](https://github.com/panva/jose/blob/main/docs/functions/key_import.importSPKI.md):

        ```tsx
        const verificationKey = await jose.importSPKI(
          "insert-your-privy-verification-key",
          "ES256"
        );
        ```

        Lastly, using [`jose.jwtVerify`](https://github.com/panva/jose/blob/main/docs/functions/jwt_verify.jwtVerify.md), verify that the JWT is valid and was issued by Privy!

        ```tsx
        const accessToken = "insert-the-users-access-token";
        try {
          const payload = await jose.jwtVerify(accessToken, verificationKey, {
            issuer: "privy.io",
            audience: "insert-your-privy-app-id",
          });
          console.log(payload);
        } catch (error) {
          console.error(error);
        }
        ```

        If the JWT is valid, you can extract the JWT's claims from the [`payload`](https://github.com/panva/jose/blob/main/docs/interfaces/types.JWTPayload.md). For example, you can use `payload.sub` to get the user's Privy DID.

        If the JWT is invalid, this method will throw an error.
      </Tab>

      <Tab title="jsonwebtoken">
        To start, install `jsonwebtoken`:

        ```sh
        npm i jsonwebtoken
        ```

        Then, load your Privy public key as a string.

        ```tsx
        const verificationKey = "insert-your-privy-verification-key".replace(
          /\\n/g,
          "\n"
        );
        ```

        The `replace` operation above ensures that any instances of `'\n'` in the stringified public key are replaced with actual newlines, per the PEM-encoded format.

        Lastly, verify the JWT using [`jwt.verify`](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback):

        ```tsx
        const accessToken = 'insert-the-user-access-token-from-request';
        try {
          const decoded = jwt.verify(accessToken, verificationKey, {
            issuer: 'privy.io',
            audience: /* your Privy App ID */
          });
          console.log(decoded);
        } catch (error) {
          console.error(error);
        }
        ```

        If the JWT is valid, you can extract the JWT's claims from `decoded`. For example, you can use `decoded.sub` to get the user's Privy DID.

        If the JWT is invalid, this method will throw an error.
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="Go">
    For Go, the [`golang-jwt`](https://github.com/golang-jwt/jwt) library is a popular choice for token verification. To start, install the library:

    ```sh
    go get -u github.com/golang-jwt/jwt/v5
    ```

    Next, load your Privy verification key and app ID as strings:

    ```go
    verificationKey := "insert-your-privy-verification-key"
    appId := "insert-your-privy-app-id"
    ```

    Then, parse the claims from the JWT and verify that they are valid:

    ```go
    accessToken := "insert-the-users-access-token"

    // Defining a Go type for Privy JWTs
    type PrivyClaims struct {
      AppId      string `json:"aud,omitempty"`
      Expiration uint64 `json:"exp,omitempty"`
      Issuer     string `json:"iss,omitempty"`
      UserId     string `json:"sub,omitempty"`
    }

    // This method will be used to check the token's claims later
    func (c *PrivyClaims) Valid() error {
      if c.AppId != appId {
        return errors.New("aud claim must be your Privy App ID.")
      }
      if c.Issuer != "privy.io" {
        return errors.New("iss claim must be 'privy.io'")
      }
      if c.Expiration < uint64(time.Now().Unix()) {
        return errors.New("Token is expired.");
      }

      return nil
    }

    // This method will be used to load the verification key in the required format later
    func keyFunc(token *jwt.Token) (interface{}, error) {
      if token.Method.Alg() != "ES256" {
        return nil, fmt.Errorf("Unexpected JWT signing method=%v", token.Header["alg"])
      }
        // https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseECPublicKeyFromPEM
      return jwt.ParseECPublicKeyFromPEM([]byte(verificationKey)), nil
    }

    // Check the JWT signature and decode claims
    // https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseWithClaims
    token, err := jwt.ParseWithClaims(accessToken, &PrivyClaims{}, keyFunc)
    if err != nil {
        fmt.Println("JWT signature is invalid.")
    }

    // Parse the JWT claims into your custom struct
    privyClaim, ok := token.Claims.(*PrivyClaims)
    if !ok {
        fmt.Println("JWT does not have all the necessary claims.")
    }

    // Check the JWT claims
    err = Valid(privyClaim);
    if err {
        fmt.Printf("JWT claims are invalid, with error=%v.", err);
        fmt.Println();
    } else {
        fmt.Println("JWT is valid.")
        fmt.Printf("%v", privyClaim)
    }
    ```

    If the JWT is valid, you can access its claims, including the user's DID, from the `privyClaim` struct above.

    If the JWT is invalid, an error will be thrown.
  </Tab>

  <Tab title="Python">
    For Python, use the `verify_access_token` method to verify the access token and get the user's claims.

    ```python
    from privy import PrivyAPI

    client = PrivyAPI(app_id="your-privy-app-id", app_secret="your-privy-api-key")
    try:
        user = client.users.verify_access_token(access_token)
        print(user)
    except Exception as e:
        print(e)
    ```

    If the token is valid, **`verify_access_token`** will return an **`AccessTokenClaims`** object with additional information about the request, with the fields below:

    | Parameter    | Type     | Description                                                                   |
    | ------------ | -------- | ----------------------------------------------------------------------------- |
    | `app_id`     | `string` | Your Privy app ID.                                                            |
    | `user_id`    | `string` | The authenticated user's Privy DID. Use this to identify the requesting user. |
    | `issuer`     | `string` | This will always be `'privy.io'`.                                             |
    | `issued_at`  | `string` | Timestamp for when the access token was signed by Privy.                      |
    | `expiration` | `string` | Timestamp for when the access token will expire.                              |
    | `session_id` | `string` | Unique identifier for the user's session.                                     |

    If the token is invalid, **`verify_access_token`** will throw an exception and you should **not** consider the requesting user authorized. This generally occurs if the token has expired or is invalid (e.g. corresponds to a different app ID).

    <Tip>
      The Privy Client's `verify_access_token` method will make a request to Privy's API to fetch the verification key for your app. You can avoid this API request by copying your verification key from the **Configuration > App settings** page of the [**Dashboard**](https://dashboard.privy.io) and passing it as a second parameter to `verify_access_token`:

      ```python
      user = client.users.verify_access_token(
        access_token,
        'paste-your-verification-key-from-the-dashboard'
      )
      ```
    </Tip>
  </Tab>
</Tabs>

## Managing expired access tokens

A user's access token might expire while they are actively using your app. For example, if a user does not take action on an application for an extended period of time, the access token can become expired.

* **Handle invalid token errors**: In these scenarios, if a method returns with an **`'invalid auth token'`** error, we recommend calling the **`getAccessToken`** method with a time-based backoff until the user's access token is refreshed with an updated expiration time.
* **Return errors from backend**: If you receive an expired access token in your backend, return an error to your client, and as above, trigger **`getAccessToken`** in your client.
* **Handle failed refreshes**: If the user's access token cannot be refreshed, the user will be logged out.


# Configure external connector chains

Privy supports connecting wallets on both EVM networks and Solana to your application. To configure your app for the wallet types you need, follow the steps below.

## Configuring EVM/Solana external connectors

<Tabs>
  <Tab title="EVM and Solana">
    <Tip>
      If you are connecting to Solana wallets, you must also initialize Solana connectors using Privy's `toSolanaWalletConnectors` method and pass them to the `config.externalWallets.solana.connectors` field.
    </Tip>

    In your `PrivyProvider`, set the `config.appearance.walletChainType` to `'ethereum-and-solana'`.

    ```tsx
    import {PrivyProvider} from '@privy-io/react-auth';
    import {toSolanaWalletConnectors} from "@privy-io/react-auth/solana";

    <PrivyProvider
      config={{
        appearance: {walletChainType: 'ethereum-and-solana'},
        externalWallets: {solana: {connectors: toSolanaWalletConnectors()}}
      }}
    >
      {children}
    </PrivyProvider>
    ```
  </Tab>

  <Tab title="EVM">
    In your `PrivyProvider`, set the `config.appearance.walletChainType` to `'ethereum-only'`.

    ```tsx
    import {PrivyProvider} from '@privy-io/react-auth';

    <PrivyProvider
      config={{
        appearance: {walletChainType: 'ethereum-only'}
      }}
    >
      {children}
    </PrivyProvider>
    ```
  </Tab>

  <Tab title="Solana">
    <Tip>
      If you are connecting to Solana wallets, you must also initialize Solana connectors using Privy's `toSolanaWalletConnectors` method and pass them to the `config.externalWallets.solana.connectors` field.
    </Tip>

    In your `PrivyProvider`, set the `config.appearance.walletChainType` to `'solana-only'`.

    ```tsx
    import {PrivyProvider} from '@privy-io/react-auth';
    import {toSolanaWalletConnectors} from "@privy-io/react-auth/solana";

    <PrivyProvider
      config={{
        appearance: {walletChainType: 'solana-only'},
        externalWallets: {
          solana: {connectors: toSolanaWalletConnectors()}
        }
      }}
    >
      {children}
    </PrivyProvider>
    ```
  </Tab>
</Tabs>



# Configure wallet options

To customize the external wallet options for your app, pass in a **`WalletListEntry`** array to the **`config.appearance.walletList`** property. When users login with, connect, or link an external wallet in your app, the possible options (e.g. MetaMask, Rainbow, WalletConnect) will be presented to users in the order you configure them in this array.

```tsx
<PrivyProvider
  appId="your-privy-app-id"
  config={{
    appearance: {
      // Defaults ['detected_wallets', 'metamask', 'coinbase_wallet', 'rainbow', 'wallet_connect']
      walletList: ['metamask', 'rainbow', 'wallet_connect'],
      ...insertTheRestOfYourAppearanceConfig
    },
    ...insertTheRestOfYourPrivyProviderConfig
  }}
>
  {children}
</PrivyProvider>
```

<Info>
  When your React web app is accessed through the in-app browser of a mobile wallet (e.g., Rainbow,
  Phantom, etc.) and that wallet is selected as a login option, the Privy SDK will automatically
  detect the wallet object and prompt the user to connect in app. However, if your app is accessed
  via a standard browser (e.g., Chrome, Safari, etc.), Privy will default to using WalletConnect for
  mobile wallet connection.
</Info>

You can also configure which wallet options to show at runtime, by passing in `walletList` to the `connectWallet` method:

```tsx
import {usePrivy} from '@privy-io/react-auth';

const {connectWallet} = usePrivy();

<button onClick={() => connectWallet({walletList: ['rainbow', 'coinbase_wallet']})}>
  Login with email and sms only
</button>;
```

The possible wallets to include in the array are:

* `detected_ethereum_wallets`
* `detected_solana_wallets`
* `metamask`
* `coinbase_wallet`
* `rainbow`
* `phantom`
* `zerion`
* `cryptocom`
* `uniswap`
* `okx_wallet`
* `universal_profile`
* `rabby_wallet`
* `bybit_wallet`
* `ronin_wallet`
* `haha_wallet`
* `safe`
* `solflare`
* `backpack`
* `binance`
* `bitkeep` (BitGet)
* `wallet_connect` (include this to capture the long-tail of wallets that support WalletConnect in your app)
* `wallet_connect_qr` (include this to just show a QR code to connect any wallet via the WalletConnect protocol)

The `detected_*_wallets` option includes all wallets that Privy detects which are not explicitly included elsewhere in the walletList array. As an example, if your user has the Zerion browser extension installed, it will appear under `detected_*_wallets` – unless you include `zerion` elsewhere in the `walletList` array, in which case it will appear in the placement of `zerion`.

<Info>
  Privy detects wallets via [EIP6963 injection](https://eips.ethereum.org/EIPS/eip-6963),
  `window.ethereum` injection, or a mobile wallet's in-app browser.
</Info>

### Configuring the Coinbase Smart Wallet

The Coinbase Smart Wallet is available to all Privy developers. To get set up, you will simply need to add Coinbase Wallet to your login flow and configure your smart wallet preference in the `config.externalWallets.coinbaseWallet.connectionOptions` property.

```tsx
<PrivyProvider
  appId="your-privy-app-id"
  config={{
    appearance: {
      walletList: ['coinbase_wallet'],
      ...insertTheRestOfYourAppearanceConfig
    },
    externalWallets: {
      coinbaseWallet: {
        // Valid connection options include 'all' (default), 'eoaOnly', or 'smartWalletOnly'
        connectionOptions: 'smartWalletOnly'
      }
    },
    ...insertTheRestOfYourPrivyProviderConfig
  }}
>
  {children}
</PrivyProvider>
```

By default, Privy will set `config.externalWallets.coinbaseWallet.connectionOptions` to `all` such that the SDK will detect whether the user has the wallet extension installed. It will popup the Coinbase wallet if they do and the Smart Wallet otherwise.

The following are valid `connectionOptions` property values:

* `eoaOnly`: The Privy SDK will only surface the Coinbase Wallet extension or Coinbase Wallet mobile app QR code. Users who do not have it installed will be prompted to install it.
* `smartWalletOnly`: The Privy SDK will surface the Coinbase Smart Wallet for all users.
* `all`: (default) The Privy SDK will detect whether the user has the Coinbase wallet extension installed. It will popup the Coinbase wallet if they do and the Smart Wallet otherwise.

<Tip>
  Smart Wallet [supports a limited number of
  chains](https://www.smartwallet.dev/FAQ#what-networks-will-be-supported-at-launch). If using `all`
  or `smartWalletOnly` connection options, be sure that your PrivyProvider [default chain and
  supported chains](/basics/react/advanced/configuring-evm-networks#supported-chains) list is a
  subset of Coinbase's supported list.
</Tip>



# Authenticate a connected wallet

<Tabs>
  <Tab title="React">
    Once a user has connected their wallet to your app, and the wallet is available in either of the **`useWallets`** arrays, you can also prompt them to **login** with that wallet or **link** that wallet to their existing account, instead of prompting the entire **`login`** or **`linkWallet`** flow.

    To do so, find the **`ConnectedWallet`** or **`ConnectedStandardSolanaWallet`** object from Privy, and call the object's **`loginOrLink`** method for EVM wallets and use the **`useLoginWithSiws`** or **`useLinkWithSiws`** hooks for the Solana wallets:

    <Tabs>
      <Tab title="EVM">
        ```tsx
        import {useWallets} from '@privy-io/react-auth';
        ...
        const {wallets} = useWallets();
        ...
        wallets[0].loginOrLink();
        ```
      </Tab>

      <Tab title="Solana">
        ```tsx
        import {useLoginWithSiws} from '@privy-io/react-auth';
        import {useWallets} from '@privy-io/react-auth/solana';

        const {wallets} = useWallets();
        const {generateSiwsMessage, loginWithSiws} = useLoginWithSiws();

        const message = await generateSiwsMessage({address: wallets[0].address});
        const encodedMessage = new TextEncoder().encode(message);
        const results = await wallets[0].signMessage({message: encodedMessage});
        await loginWithSiws({message: encodedMessage, signature: results.signature});
        ```
      </Tab>
    </Tabs>

    When called, **`loginOrLink`** will directly request a [SIWE](https://docs.login.xyz/general-information/siwe-overview/eip-4361) signature from the user's connected wallet to authenticate the wallet.

    If the user was not **`authenticated`** when the method was called, the user will become **`authenticated`** after signing the message.

    If the user was already **`authenticated`** when the method was called, the user will remain **`authenticated`** after signing the message, and the connected wallet will become one of the user's **`linkedAccounts`** in their **`user`** object.

    You might use the methods above to "split up" the connect and sign steps of external wallet login, like so:

    <Tabs>
      <Tab title="EVM">
        ```tsx
        import {useConnectWallet, useWallets} from '@privy-io/react-auth';

        export default function WalletButton() {
        const {connectWallet} = useConnectWallet();
        const {wallets} = useWallets();

        // Prompt user to connect a wallet with Privy modal
        return (
            {/* Button to connect wallet */}
            <button
                onClick={connectWallet}>
                Connect wallet
            </button>
            {/* Button to login with or link the most recently connected wallet */}
            <button
                disabled={!wallets[0]}
                onClick={() => { wallets[0].loginOrLink() }}>
                Login with wallet
            </button>
        );
        }
        ```
      </Tab>

      <Tab title="Solana">
        ```tsx
        import {useConnectWallet, useLoginWithSiws} from '@privy-io/react-auth';
        import {useWallets} from '@privy-io/react-auth/solana';

        export default function WalletButton() {
          const {connectWallet} = useConnectWallet();
          const {wallets} = useWallets();
          const {generateSiwsMessage, loginWithSiws} = useLoginWithSiws()

          // Prompt user to connect a wallet with Privy modal
          return (
            {/* Button to connect wallet */}
            <button
                onClick={connectWallet}>
                Connect wallet
            </button>
            {/* Button to login with the most recently connected wallet */}
            <button
                disabled={!wallets[0]}
                onClick={async () => {
                  const message = await generateSiwsMessage({address: wallets[0].address})
                  const encodedMessage = new TextEncoder().encode(message)
                  const results = await wallets[0].signMessage({message: encodedMessage})
                  await loginWithSiws({message: encodedMessage, signature: results.signature})
                }}
            >
                Login with wallet
            </button>
          );
        }
        ```
      </Tab>
    </Tabs>
  </Tab>
</Tabs>



# Authenticate a connected wallet

<Tabs>
  <Tab title="React">
    Once a user has connected their wallet to your app, and the wallet is available in either of the **`useWallets`** arrays, you can also prompt them to **login** with that wallet or **link** that wallet to their existing account, instead of prompting the entire **`login`** or **`linkWallet`** flow.

    To do so, find the **`ConnectedWallet`** or **`ConnectedStandardSolanaWallet`** object from Privy, and call the object's **`loginOrLink`** method for EVM wallets and use the **`useLoginWithSiws`** or **`useLinkWithSiws`** hooks for the Solana wallets:

    <Tabs>
      <Tab title="EVM">
        ```tsx
        import {useWallets} from '@privy-io/react-auth';
        ...
        const {wallets} = useWallets();
        ...
        wallets[0].loginOrLink();
        ```
      </Tab>

      <Tab title="Solana">
        ```tsx
        import {useLoginWithSiws} from '@privy-io/react-auth';
        import {useWallets} from '@privy-io/react-auth/solana';

        const {wallets} = useWallets();
        const {generateSiwsMessage, loginWithSiws} = useLoginWithSiws();

        const message = await generateSiwsMessage({address: wallets[0].address});
        const encodedMessage = new TextEncoder().encode(message);
        const results = await wallets[0].signMessage({message: encodedMessage});
        await loginWithSiws({message: encodedMessage, signature: results.signature});
        ```
      </Tab>
    </Tabs>

    When called, **`loginOrLink`** will directly request a [SIWE](https://docs.login.xyz/general-information/siwe-overview/eip-4361) signature from the user's connected wallet to authenticate the wallet.

    If the user was not **`authenticated`** when the method was called, the user will become **`authenticated`** after signing the message.

    If the user was already **`authenticated`** when the method was called, the user will remain **`authenticated`** after signing the message, and the connected wallet will become one of the user's **`linkedAccounts`** in their **`user`** object.

    You might use the methods above to "split up" the connect and sign steps of external wallet login, like so:

    <Tabs>
      <Tab title="EVM">
        ```tsx
        import {useConnectWallet, useWallets} from '@privy-io/react-auth';

        export default function WalletButton() {
        const {connectWallet} = useConnectWallet();
        const {wallets} = useWallets();

        // Prompt user to connect a wallet with Privy modal
        return (
            {/* Button to connect wallet */}
            <button
                onClick={connectWallet}>
                Connect wallet
            </button>
            {/* Button to login with or link the most recently connected wallet */}
            <button
                disabled={!wallets[0]}
                onClick={() => { wallets[0].loginOrLink() }}>
                Login with wallet
            </button>
        );
        }
        ```
      </Tab>

      <Tab title="Solana">
        ```tsx
        import {useConnectWallet, useLoginWithSiws} from '@privy-io/react-auth';
        import {useWallets} from '@privy-io/react-auth/solana';

        export default function WalletButton() {
          const {connectWallet} = useConnectWallet();
          const {wallets} = useWallets();
          const {generateSiwsMessage, loginWithSiws} = useLoginWithSiws()

          // Prompt user to connect a wallet with Privy modal
          return (
            {/* Button to connect wallet */}
            <button
                onClick={connectWallet}>
                Connect wallet
            </button>
            {/* Button to login with the most recently connected wallet */}
            <button
                disabled={!wallets[0]}
                onClick={async () => {
                  const message = await generateSiwsMessage({address: wallets[0].address})
                  const encodedMessage = new TextEncoder().encode(message)
                  const results = await wallets[0].signMessage({message: encodedMessage})
                  await loginWithSiws({message: encodedMessage, signature: results.signature})
                }}
            >
                Login with wallet
            </button>
          );
        }
        ```
      </Tab>
    </Tabs>
  </Tab>
</Tabs>


# Integrating with wagmi

[Wagmi](https://wagmi.sh/) is a set of React hooks for interfacing with Ethereum wallets, allowing you read wallet state, request signatures or transactions, and take read and write actions on the blockchain.

**Privy is fully compatible with [wagmi](https://wagmi.sh/), and you can use [wagmi](https://wagmi.sh/)'s React hooks to interface with external and embedded wallets from Privy.** Just follow the steps below!

## Integration steps

This guide assumes you have already integrated Privy into your app. If not, please begin with the Privy [Quickstart](/basics/react/quickstart).

### 1. Install dependencies

Install the latest versions of [**`wagmi`**](https://www.npmjs.com/package/wagmi), [**`@tanstack/react-query`**](https://www.npmjs.com/package/@tanstack/react-query), [**`@privy-io/react-auth`**](https://www.npmjs.com/package/@privy-io/react-auth), and [**`@privy-io/wagmi`**](https://www.npmjs.com/package/@privy-io/wagmi):

```sh
npm i wagmi @privy-io/react-auth @privy-io/wagmi @tanstack/react-query
```

### 2. Setup TanStack Query

To start, set up your app with the [TanStack Query's React Provider](https://tanstack.com/query/v5/docs/framework/react/overview). Wagmi uses TanStack Query under the hood to power its data fetching and caching of wallet and blockchain data.

To set up your app with TanStack Query, in the component where you render your **`PrivyProvider`**, import the [**`QueryClient`**](https://tanstack.com/query/v4/docs/reference/QueryClient) class and the [**`QueryClientProvider`**](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider) component from [**`@tanstack/react-query`**](https://www.npmjs.com/package/@tanstack/react-query):

```tsx
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
```

Next, create a new instance of the [**`QueryClient`**](https://tanstack.com/query/v4/docs/reference/QueryClient):

```tsx
const queryClient = new QueryClient();
```

Then, like the **`PrivyProvider`**, wrap your app's components with the [**`QueryClientProvider`**](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider). This must be rendered *inside* the **`PrivyProvider`** component.

```tsx providers.tsx
<PrivyProvider appId="your-privy-app-id" config={insertYourPrivyConfig}>
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
</PrivyProvider>
```

For the [**`client`**](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider) property of the [**`QueryClientProvider`**](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider), pass the [**`queryClient`**](https://tanstack.com/query/v4/docs/reference/QueryClient) instance you created.

### 3. Setup wagmi

Next, setup wagmi. This involves creating your wagmi **`config`** and wrapping your app with the **`WagmiProvider`**.

<Warning>
  While completing the wagmi setup, make sure to import `createConfig` and `WagmiProvider` from
  `@privy-io/wagmi`. Do not import these from `wagmi` directly.
</Warning>

#### Build your wagmi config

To build your [**`wagmi`**](https://wagmi.sh) config, import the `createConfig` method from [**`@privy-io/wagmi`**](https://www.npmjs.com/package/@privy-io/wagmi):

```tsx wagmiConfig.ts
import {createConfig} from '@privy-io/wagmi';
```

This is a drop-in replacement for [wagmi's native **`createConfig`**](https://wagmi.sh/react/getting-started#create-config), but ensures that the appropriate configuration options are set for the Privy integration. Specifically, it allows Privy to drive wagmi's connectors state, enabling the two libraries to stay in sync.

Next, import your app's required chains from [**`viem/chains`**](https://viem.sh/docs/chains/introduction.html) and the [**`http`**](https://wagmi.sh/core/api/transports/http#http) transport from [**`wagmi`**](https://www.npmjs.com/package/wagmi). Your app's required chains should match whatever you configure as [**`supportedChains`**](/basics/react/advanced/configuring-evm-networks#supported-chains) for Privy.

```tsx
import {mainnet, sepolia} from 'viem/chains';
import {http} from 'wagmi';

// Replace this with your app's required chains
```

Lastly, call `createConfig` with your imported chains and the [**`http`**](https://wagmi.sh/core/api/transports/http#http) transport like so:

```tsx wagmiConfig.ts
// Make sure to import `createConfig` from `@privy-io/wagmi`, not `wagmi`
import {createConfig} from '@privy-io/wagmi';
...
export const config = createConfig({
  chains: [mainnet, sepolia], // Pass your required chains as an array
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    // For each of your required chains, add an entry to `transports` with
    // a key of the chain's `id` and a value of `http()`
  },
});
```

#### Wrap your app with the `WagmiProvider`

Once you've built your wagmi `config`, in the same component where you render your **`PrivyProvider`**, import the `WagmiProvider` component from [**`@privy-io/wagmi`**](https://www.npmjs.com/package/@privy-io/wagmi).

```tsx
import {WagmiProvider} from '@privy-io/wagmi';
```

This is a drop-in replacement for [wagmi's native **`WagmiProvider`**](https://wagmi.sh/react/api/WagmiProvider#wagmiprovider), but ensures the necessary configuration properties for Privy are set. Specifically, it ensures that the [**`reconnectOnMount`**](https://wagmi.sh/react/api/WagmiProvider#reconnectonmount) prop is set to false, which is required for handling the embedded wallet. Wallets will still be automatically reconnected on mount.

Then, like the **`PrivyProvider`**, wrap your app's components with the `WagmiProvider`. This must be rendered *inside* both the **`PrivyProvider`** and [**`QueryClientProvider`**](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider) components.

```tsx providers.tsx
import {PrivyProvider} from '@privy-io/react-auth';
// Make sure to import `WagmiProvider` from `@privy-io/wagmi`, not `wagmi`
import {WagmiProvider} from '@privy-io/wagmi';
import {QueryClientProvider} from '@tanstack/react-query';
...
<PrivyProvider appId='insert-your-privy-app-id' config={insertYourPrivyConfig}>
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  </QueryClientProvider>
</PrivyProvider>
```

For the `config` property of the `WagmiProvider`, pass the `config` you created earlier.

#### Complete example

Altogether, this should look like:

<Tabs>
  <Tab title="providers.tsx">
    ```tsx
    import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

    import {PrivyProvider} from '@privy-io/react-auth';
    // Make sure to import these from `@privy-io/wagmi`, not `wagmi`
    import {WagmiProvider, createConfig} from '@privy-io/wagmi';

    import {privyConfig} from './privyConfig';
    import {wagmiConfig} from './wagmiConfig';

    const queryClient = new QueryClient();

    export default function Providers({children}: {children: React.ReactNode}) {
      return (
        <PrivyProvider appId="insert-your-privy-app-id" config={privyConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>
      );
    }
    ```
  </Tab>

  <Tab title="wagmiConfig.ts">
    ```tsx
    import {mainnet, sepolia} from 'viem/chains';
    import {http} from 'wagmi';

    import {createConfig} from '@privy-io/wagmi';

    // Replace these with your app's chains

    export const config = createConfig({
      chains: [mainnet, sepolia],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    });
    ```
  </Tab>

  <Tab title="privyConfig.ts">
    ```tsx
    import type {PrivyClientConfig} from '@privy-io/react-auth';

    // Replace this with your Privy config
    export const privyConfig: PrivyClientConfig = {
      embeddedWallets: {
        createOnLogin: 'users-without-wallets',
        requireUserPasswordOnCreate: true,
        showWalletUIs: true
      },
      loginMethods: ['wallet', 'email', 'sms'],
      appearance: {
        showWalletLoginFirst: true
      }
    };
    ```
  </Tab>
</Tabs>

**That's it! You've successfully integrated Privy alongside [`wagmi`](https://wagmi.sh) in your app! 🎉**

### 4. Use `wagmi` throughout your app

Once you've completed the setup above, you can use [**`wagmi`**](https://wagmi.sh)'s React hooks throughout your app to interface with wallets and take read and write actions on the blockchain.

#### Using `wagmi` hooks

To use [**`wagmi`**](https://wagmi.sh) hooks, like [**`useAccount`**](https://wagmi.sh/react/api/hooks/useAccount#useaccount), in your components, import the hook directly from [**`wagmi`**](https://wagmi.sh) and call it as usual:

```tsx
import {useAccount} from 'wagmi';

export default const WalletAddress = () => {
  const {address} = useAccount();
  return <p>Wallet address: {address}</p>;
}
```

<Info>
  Injected wallets, like the MetaMask browser extension, cannot be programmatically disconnected from your site; they can only be manually disconnected. In kind, Privy does not currently support programmatically disconnecting a wallet via wagmi's [`useDisconnect`](https://wagmi.sh/react/api/hooks/useDisconnect) hook. This hook "shims" a disconnection, which can create discrepancies between what wallets are connected to an app vs. wagmi.

  Instead of disconnecting a given wallet, you can always prompt a user to connect a different wallet via the [`connectWallet`](/wallets/connectors/usage/connecting-external-wallets) method.
</Info>

#### When to use Privy vs. `wagmi`

Both Privy's out-of-the-box interfaces and wagmi's React hooks enable you to interface with wallets and to request signatures and transactions.

If your app integrates Privy alongside wagmi, you should:

* use Privy to connect external wallets and create embedded wallets
* use [**`wagmi`**](https://wagmi.sh) to take read or write actions from a connected wallet

#### Updating the active wallet

With Privy, users may have multiple wallets connected to your app, but [**`wagmi`**](https://wagmi.sh)'s React hooks return information for only *one* connected wallet at a time. This is referred to as the **active wallet**.

To update [**`wagmi`**](https://wagmi.sh) to return information for a *different* connected wallet, first import the **`useWallets`** hook from [**`@privy-io/react-auth`**](https://www.npmjs.com/package/@privy-io/react-auth) and the `useSetActiveWallet` hook from [**`@privy-io/wagmi`**](https://www.npmjs.com/package/@privy-io/wagmi):

```tsx
import {useWallets} from '@privy-io/react-auth';
import {useSetActiveWallet} from '@privy-io/wagmi';
```

Then, find your desired active wallet from the **`wallets`** array returned by **`useWallets`**

```tsx
const {wallets} = useWallets();
// Replace this logic to find your desired wallet
const newActiveWallet = wallets.find((wallet) => wallet.address === 'insert-your-desired-address');
```

Lastly, pass your desired active wallet to the `setActiveWallet` method returned by the `useSetActiveWallet` hook:

```tsx
await setActiveWallet(newActiveWallet);
```

## Demo app

Check out our [wagmi demo app](https://wagmi-app.vercel.app) to see the hooks listed above in action.

Feel free to take a look at the [app's source code](https://github.com/privy-io/wagmi-demo/tree/main) to see an end-to-end implementation of Privy with wagmi.

