---
title: SAML Deconstructed
date: 2025-12-10 00:00:00 -0400
category: Identity
tags: [iam, saml, sso, xml]
---

## TL;DR

SAML 2.0 is an XML-based federation protocol that enables Single Sign-On (SSO) by allowing Service Providers to trust assertions from Identity Providers. This post breaks down SAML's core components, authentication flows, assertion anatomy, security mechanisms, and common implementation pitfalls.

---

## What is SAML, actually?

**SAML (Security Assertion Markup Language)** is a widely-adopted XML-based standard for exchanging authentication and authorization data between an Identity Provider (IdP) and a Service Provider (SP). The protocol was created by OASIS and has been the enterprise standard for web-based SSO since the early 2000s. Although newer protocols like OpenID Connect (OIDC) are gaining traction in modern applications, SAML remains the backbone of enterprise SSO deployments, particularly for on-premises and legacy SaaS applications.

SAML is fairly straightforward; instead of managing separate credentials for each application, users authenticate once with their organization's IdP, which then issues cryptographically signed assertions that prove the user's identity to downstream Service Providers. The SP trusts the IdP's assertions, validates the signature, and grants access accordingly. Think of it as the visa stamp to your passport.

---

## Core SAML Components

### SAML Assertions

SAML-based authentication all starts with what is known as the assertion. This assertion is actually an XML document that contains statements about a user, containing three types of statements:

**Authentication Statement**: Confirms that the user was authenticated at a specific time using a particular method (password, MFA, certificate, etc.)

**Attribute Statement**: Contains user attributes like email, name, group memberships, department, or any custom claims the SP needs for authorization decisions.

**Authorization Decision Statement**: Declares whether the user is allowed to access a specific resource. Less commonly used in practice since most SPs handle authorization internally.

### SAML Request (AuthnRequest)

When a user attempts to access an SP without an active session, the SP generates an AuthnRequest, which is an XML document asking the IdP to authenticate the user. The request includes:
- The SP's entity ID
- The assertion consumer service (ACS) URL where the IdP should send the response
- Requested authentication context (password, MFA, certificate)
- Whether the assertion should be signed

### SAML Response

After authenticating the user, the IdP generates a SAML Response containing one or more assertions. The response includes:
- Status of the authentication attempt (success, failure, error codes)
- The signed assertion(s)
- Issuer information (the IdP's entity ID)
- Destination URL (where the response should be sent)

### SAML Bindings

SAML messages need to travel between browsers, IdPs, and SPs. Bindings define how SAML protocol messages are transported. The most common are:

**HTTP-POST Binding**: SAML messages are base64-encoded and sent via HTML form POST. This is the most widely used binding for SP-initiated flows.

**HTTP-Redirect Binding**: SAML messages are URL-encoded and sent as query parameters in a redirect. Typically used for AuthnRequests in SP-initiated flows.

**HTTP-Artifact Binding**: Instead of sending the full SAML message through the browser, a small artifact (reference token) is sent. The SP then retrieves the full message directly from the IdP via a back-channel call. Useful for very large assertions.

---

## SAML Authentication Flows

### SP-Initiated Flow

This is the most common flow. The user starts at the Service Provider and is redirected to the IdP for authentication.

1. **User accesses SP**: User navigates to `app.example.com` without an active session
2. **SP generates AuthnRequest**: SP creates a SAML AuthnRequest and redirects the user's browser to the IdP's Single Sign-On (SSO) endpoint
3. **User authenticates at IdP**: IdP prompts for credentials (username/password, MFA, etc.)
4. **IdP generates SAML Response**: Upon successful authentication, IdP creates a signed SAML assertion containing user identity and attributes
5. **Browser POSTs response to SP**: IdP instructs the browser to POST the SAML response to the SP's Assertion Consumer Service (ACS) URL
6. **SP validates assertion**: SP verifies the signature, checks issuer, validates timestamps, and confirms audience restrictions
7. **SP creates session**: SP establishes a local session and grants access to the user

### IdP-Initiated Flow

The user starts at the IdP portal (like Okta or Azure AD) and clicks on an app tile. The IdP generates an unsolicited SAML assertion and sends the user to the SP.

1. **User logs into IdP portal**: User authenticates to `company.okta.com`
2. **User clicks app tile**: User selects an application from the dashboard
3. **IdP generates assertion**: IdP creates a signed SAML assertion without receiving an AuthnRequest
4. **Browser POSTs to SP**: IdP sends the user to the SP's ACS URL with the assertion
5. **SP validates and creates session**: SP validates the assertion and grants access

**Security note**: IdP-initiated flows are less secure because there's no request/response correlation. This makes them vulnerable to assertion replay attacks if not properly protected with short validity windows and strong audience restrictions.

---

## Anatomy of a SAML Assertion

Let's break down what's inside a typical SAML assertion:

```xml
<saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                ID="_abc123xyz789"
                IssueInstant="2025-12-10T15:30:00Z"
                Version="2.0">
    
    <!-- Who issued this assertion -->
    <saml:Issuer>https://idp.company.com</saml:Issuer>
    
    <!-- Cryptographic signature -->
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <!-- Signature details omitted for brevity -->
    </ds:Signature>
    
    <!-- Who is this assertion about -->
    <saml:Subject>
        <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
            user@company.com
        </saml:NameID>
        <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
            <saml:SubjectConfirmationData 
                NotOnOrAfter="2025-12-10T15:35:00Z"
                Recipient="https://app.example.com/acs"
                InResponseTo="_request123"/>
        </saml:SubjectConfirmation>
    </saml:Subject>
    
    <!-- Validity period -->
    <saml:Conditions 
        NotBefore="2025-12-10T15:30:00Z"
        NotOnOrAfter="2025-12-10T15:35:00Z">
        <saml:AudienceRestriction>
            <saml:Audience>https://app.example.com</saml:Audience>
        </saml:AudienceRestriction>
    </saml:Conditions>
    
    <!-- Authentication details -->
    <saml:AuthnStatement 
        AuthnInstant="2025-12-10T15:30:00Z"
        SessionIndex="_session456">
        <saml:AuthnContext>
            <saml:AuthnContextClassRef>
                urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
            </saml:AuthnContextClassRef>
        </saml:AuthnContext>
    </saml:AuthnStatement>
    
    <!-- User attributes -->
    <saml:AttributeStatement>
        <saml:Attribute Name="email">
            <saml:AttributeValue>user@company.com</saml:AttributeValue>
        </saml:Attribute>
        <saml:Attribute Name="firstName">
            <saml:AttributeValue>Jane</saml:AttributeValue>
        </saml:Attribute>
        <saml:Attribute Name="lastName">
            <saml:AttributeValue>Doe</saml:AttributeValue>
        </saml:Attribute>
        <saml:Attribute Name="groups">
            <saml:AttributeValue>Engineering</saml:AttributeValue>
            <saml:AttributeValue>Admins</saml:AttributeValue>
        </saml:Attribute>
    </saml:AttributeStatement>
    
</saml:Assertion>
```

**Key elements explained:**

- **Assertion ID**: Unique identifier for replay detection
- **IssueInstant**: Timestamp when the assertion was created
- **Issuer**: The IdP's entity ID—must match what the SP expects
- **Signature**: XML digital signature using the IdP's private key, verified by SP using IdP's public certificate
- **Subject**: Identifies the user (NameID) and confirms they're the bearer of this assertion
- **Conditions**: Time window (`NotBefore`/`NotOnOrAfter`) and audience restrictions (which SP can use this assertion)
- **AuthnStatement**: How and when the user authenticated
- **AttributeStatement**: User profile data and group memberships

---

## SAML Security Mechanisms

### XML Signatures

SAML relies on XML digital signatures to ensure assertion integrity and authenticity. The IdP signs the assertion (or entire response) with its private key, and the SP verifies it using the IdP's public certificate exchanged during metadata configuration.

**Critical validation checks**:
- Signature algorithm is strong (RSA-SHA256 or higher, not SHA1)
- Certificate is valid and trusted
- Signed elements haven't been tampered with

### Audience Restrictions

The `<AudienceRestriction>` element specifies which SP(s) are allowed to consume the assertion. The SP must validate that its own entity ID appears in the audience list. This prevents an attacker from capturing an assertion meant for `app-a.com` and replaying it to `app-b.com`.

### Time Validity

Assertions include `NotBefore` and `NotOnOrAfter` timestamps defining a short validity window (typically 5 minutes). SPs must reject assertions outside this window to prevent replay attacks.

**Clock skew**: Allow a small tolerance (1-2 minutes) for clock differences between IdP and SP servers.

### Assertion Uniqueness

Each assertion has a unique ID. SPs should track recently seen assertion IDs and reject duplicates within the validity window to prevent replay attacks.

### HTTPS/TLS

SAML messages contain sensitive user data and must be transmitted over HTTPS. While signatures protect integrity, TLS protects confidentiality during transit.

---

## SAML Metadata

Rather than manually configuring IdP and SP settings, SAML uses XML metadata documents that both parties exchange.

**IdP Metadata** contains:
- Entity ID
- SSO endpoint URLs
- Signing certificates
- Supported name ID formats
- Logout endpoints

**SP Metadata** contains:
- Entity ID
- Assertion Consumer Service (ACS) URLs
- Signing/encryption certificates
- Requested attributes
- Logout endpoints

Most IdPs and SPs allow you to upload or fetch metadata via URL, drastically simplifying configuration and reducing human error.

---

## Common SAML Implementation Pitfalls

### Signature Validation Bypass

**The issue**: Failing to properly validate XML signatures or allowing unsigned assertions when signatures are expected.

**The fix**: Always require and validate signatures. Never trust assertions without proper signature verification. Use well-tested SAML libraries rather than rolling your own parser.

### XML Signature Wrapping Attacks

**The issue**: Attackers manipulate XML structure to inject malicious content that bypasses signature validation.

**The fix**: Use SAML libraries that properly validate the entire signed structure. Ensure the signed element is the one being processed, not a sibling or manipulated duplicate.

### Weak Audience Validation

**The issue**: Not checking audience restrictions or accepting assertions meant for other SPs.

**The fix**: Strictly validate that your SP's entity ID is in the `<Audience>` element. Reject assertions without audience restrictions.

### Clock Skew Issues

**The issue**: Assertions rejected due to slight time differences between IdP and SP servers.

**The fix**: Allow a small clock skew tolerance (1-2 minutes) when validating `NotBefore`/`NotOnOrAfter` conditions. Ensure NTP is configured on all systems.

### IdP-Initiated Flow Vulnerabilities

**The issue**: IdP-initiated flows lack request/response correlation, making them vulnerable to CSRF and replay attacks.

**The fix**: If IdP-initiated flows are required, use short assertion lifetimes (60-120 seconds), implement aggressive replay detection, and consider additional anti-CSRF tokens.

### Insufficient Attribute Validation

**The issue**: Trusting user attributes without validation, leading to privilege escalation (e.g., manipulated group membership claims).

**The fix**: Validate attribute values against expected formats. Don't blindly trust IdP-provided role/group claims—implement additional authorization checks in your application.

### Certificate Management Failures

**The issue**: Expired certificates break SSO, or old certificates aren't rotated out, creating security risks.

**The fix**: Implement certificate monitoring and alerts. Support multiple active certificates during rotation periods. Automate metadata updates when certificates change.

---

## SAML in Practice

### When to Use SAML

- Enterprise SSO for web applications
- B2B federations with partner organizations
- Legacy applications that don't support modern protocols
- Environments where XML signing/encryption is mandated
- Strong attribute exchange requirements

### When NOT to Use SAML

- Mobile applications (OIDC is better suited)
- Modern single-page applications (OIDC is simpler)
- API authentication (use OAuth 2.0)
- Consumer-facing applications (OIDC's simplicity wins)

---

## Lessons Learned

SAML's complexity is both its strength and weakness. The XML-based structure allows incredible flexibility in attribute exchange and supports advanced security features like encryption and multiple signatures. However, this complexity introduces implementation pitfalls that have led to numerous security vulnerabilities over the years. The elephant in the room is that SAML's age is showing—modern alternatives like OIDC offer similar security guarantees with far less complexity.

That said, SAML isn't going anywhere soon. With decades of enterprise deployments and deep integration into legacy systems, understanding SAML remains essential for anyone working in identity and access management. The key is using battle-tested libraries, following security best practices, and recognizing when a simpler protocol would be more appropriate.

---

## Further Reading

- [OASIS SAML 2.0 Specification](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- [SAML Developer Tools](https://www.samltool.com/generic_sso_req.php)
- [Okta SAML Guidance](https://developer.okta.com/docs/concepts/saml/)
