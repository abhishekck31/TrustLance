# User Roles

TrustLance supports three primary roles that interact with the platform through smart contracts and decentralized interfaces.


## 1. Client

The client is the party that creates a job and funds the escrow.

### Responsibilities
- Define job requirements and milestones
- Fund the escrow contract
- Review submitted work
- Approve or reject milestones
- Raise disputes if work is unsatisfactory

### Allowed Actions
- Create a job
- Deposit funds into escrow
- Approve milestone completion
- Initiate a dispute
- Receive refunds if dispute verdict favors the client

## 2. Freelancer

The freelancer completes the job and delivers work according to milestones.

### Responsibilities
- Accept job terms
- Complete assigned milestones
- Submit work proof (IPFS hash or reference)
- Respond to disputes

### Allowed Actions
- Accept a job
- Submit milestone deliverables
- Request milestone approval
- Receive escrowed payments upon approval

## 3. DAO Juror

DAO Jurors are neutral participants who resolve disputes in a decentralized manner.

### Responsibilities
- Review dispute evidence
- Vote honestly based on presented facts
- Maintain platform integrity

### Allowed Actions
- Participate in dispute voting
- Stake governance tokens
- Receive rewards or penalties based on voting accuracy


## System Constraints

- A user cannot act as both client and freelancer for the same job
- Jurors involved in a dispute cannot be the client or freelancer
- Once a dispute is raised, funds are frozen until resolution
- All critical actions must be validated on-chain


## Out of Scope (Not Built in MVP)

To maintain focus and security, the following features are intentionally excluded from the initial version:
- In-app chat or messaging system
- AI-based dispute resolution
- Fiat on-ramp/off-ramp integration
- Mobile applications
- Cross-chain support
