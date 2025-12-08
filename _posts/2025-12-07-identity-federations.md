---
title: Identity Federations
date: 2025-12-07 17:30:00 -0400
categories: [Identity]
tags: [iam, saml, oauth, oidc, sso]
---

## TL;DR

Identity federation enables users from one organization to access resources in another using shared trust and standard protocols (SAML, OAuth 2.0, OpenID Connect). This post covers core concepts, common protocols, authentication flows, security considerations, and practical implementation guidance.

---

## What is a federation, exactly?

**Identity federation** is the practice of establishing trust relationships between identity providers (IdPs) and service providers (SPs) to enable cross-organization authentication and authorization. Instead of creating separate accounts in every system, users authenticate once with their home IdP and gain access to federated services through token or assertion exchange. In other words, federations are what allows users to sign into various applications/services using credentials from a different service. Notably, identity federations are what enable Single Sign-on (SSO). A very common example of federation and SSO that you probably have seen is the "Sign in with Google" feature, which uses OpenID Connect (OIDC) built on top of OAuth 2.0 to authenticate you with your Google credentials.

### Why do it?

There are a large number of benefits that make identity federation a best-practice for enterprises. When an organization is governing over hundreds, possibly thousands, of users, it's critical that IT and Security teams have the technology in place to implement even more complex actions such as controls, automation, and operations at scale. Key benefits are:
- **Single Sign-On (SSO)**: Users authenticate once and access multiple applications
- **Reduced credential sprawl**: Fewer passwords to manage and secure
- **Centralized access control**: Organizations maintain control over their users' identities
- **Simplified offboarding**: Revoke access at the IdP to remove downstream permissions
- **Enhanced security**: Enforce MFA and conditional access policies centrally

---

## So what do I need for a federation?

### Identity Provider (IdP)
This is the authoritative source for user authentication. The IdP:
- Authenticates users (username/password, MFA, biometrics)
- Issues tokens or assertions containing user identity and attributes
- Examples: Okta, Azure AD, Ping Identity, OneLogin, Google Workspace

### Service Provider / Relying Party (SP/RP)
The application or service that trusts the IdP's assertions. The SP:
- Accepts and validates tokens/assertions from trusted IdPs
- Makes authorization decisions based on claims
- Grants access to resources

### Federation Metadata
Machine-readable configuration exchanged between IdP and SP containing:
- Endpoints (login, logout, token URLs)
- Public keys/certificates for signature verification
- Supported protocols and bindings
- Entity identifiers

### Claims and Attributes
Identity information carried in tokens/assertions:
- User identifiers (email, UPN, subject ID)
- Profile attributes (name, department, location)
- Group memberships and roles
- Entitlements and permissions

---

## Common Federation Protocols

There are several authentication protocols which allow federations to happen. Of these protocols, you will commonly see: SAML, OAuth 2.0, OIDC, and SCIM.

### SAML 2.0 (Security Assertion Markup Language)

**Use case**: Enterprise SSO, especially for legacy web applications

**Key characteristics**:
- XML-based assertions
- Browser-based flows (HTTP Redirect, HTTP POST)
- Strong in B2B federations
- Supports IdP-initiated and SP-initiated flows

**Flow (SP-initiated)**:
1. User accesses SP application
2. SP redirects to IdP with SAML AuthnRequest
3. User authenticates at IdP
4. IdP returns signed SAML assertion (via browser POST)
5. SP validates assertion and creates session

### OAuth 2.0

**Use case**: Delegated authorization (granting limited access to resources)

**Key characteristics**:
- Authorization framework, not authentication protocol
- Access tokens represent delegated permissions
- Multiple grant types (Authorization Code, Client Credentials, etc.)
- Widely used for API access

**Important**: OAuth 2.0 alone does NOT authenticate users—it authorizes access. Use OpenID Connect for authentication.

### OpenID Connect (OIDC)

**Use case**: Modern authentication for web, mobile, and SPA applications

**Key characteristics**:
- Authentication layer built on OAuth 2.0
- Issues ID tokens (JWTs) containing user identity
- Standardized user info endpoint
- Support for dynamic client registration

**Flow (Authorization Code)**:
1. User accesses RP application
2. RP redirects to IdP authorization endpoint
3. User authenticates and consents
4. IdP returns authorization code
5. RP exchanges code for ID token and access token
6. RP validates ID token (signature, issuer, audience, expiry)

### SCIM (System for Cross-domain Identity Management)

**Use case**: Automated user and group provisioning/deprovisioning. Not actually required to create an identity federation, but an absolute best practice as it drastically impacts access management.

**Key characteristics**:
- RESTful API for identity lifecycle management
- Create, read, update, delete (CRUD) operations
- Often used alongside SAML/OIDC for just-in-time provisioning
- Enables automated user onboarding/offboarding

---

## Real-World Patterns

### Enterprise SSO
A central IdP (Azure AD, Okta) federates to SaaS applications. From the IdP, employees authenticate once and access all integrated apps.

**Example**: Employee logs into Okta → accesses Salesforce, GitHub, Slack without re-authenticating

### B2B Partner Access
Partner organizations establish federated trust. Afterwards, partner employees access resources using their home credentials.

**Example**: Contractor from Company A uses their Company A credentials to access Company B's project management system

### Academic Federations
Universities join federations (InCommon, eduGAIN) enabling students/staff to access shared resources across institutions.

**Example**: Student uses university credentials to access research databases at other member institutions

### Customer Identity (CIAM)
Consumer-facing applications allow social login (Google, Facebook) or enterprise federation.

**Example**: E-commerce site allows "Sign in with Google" or enterprise SAML for B2B customers

---

## Further Reading
- [Okta Identity Federation](https://developer.okta.com/docs/concepts/federation/)
- [Azure AD Federation](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/)
- [AWS IAM Identity Federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html)
