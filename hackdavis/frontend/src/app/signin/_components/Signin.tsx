'use client'
import { withAuthInfo, useRedirectFunctions, useLogoutFunction, WithAuthInfoProps } from '@propelauth/react'

const SignIn = withAuthInfo((props: WithAuthInfoProps) => {
    const logoutFunction = useLogoutFunction()
    const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions()
    // Or if you want to make links instead
    // const { getLoginPageUrl, getSignupPageUrl, getAccountPageUrl } = useHostedPageUrls()

    if (props.isLoggedIn) {
        return (
            <div>
                <p>You are logged in as {props.user.email}</p>
                <button onClick={() => redirectToAccountPage()}>Account</button>
                <button onClick={() => logoutFunction(true)}>Logout</button>
            </div>
        )
    } else {
        return (
            <div>
                <p>You are not logged in</p>
                <button onClick={() => redirectToLoginPage()}>Login</button>
                <button onClick={() => redirectToSignupPage()}>Signup</button>
            </div>
        )
    }
})

export default SignIn
