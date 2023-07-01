1. Implement `revokeClaim` function: 
    i. Add permission check for the sender to revoke the claim.
    ii. Remove or mark the mentioned claim as revoked.
    iii. Emit the `ClaimRevoked` event.

2. Implement `revokeClaimBySignature` function: 
    i. Calculate the claimId using the provided signature.
    ii. Call the `revokeClaim()` function using the calculated claimId and `msg.sender`

3. Implement `isClaimRevoked` function: 
    i. Generate the claimId using the given signature.
    ii. Verify if the calculated claim has been revoked.

4. Implement `isClaimValid` function:
    i. Validate the claim data using the provided signature.
    ii. Confirm the claim is not revoked and accordingly return the result.

5. Implement `getRecoveredAddress` function:
    i. Retrieve the address used to sign the hashed data using ecrecover.
    ii. Return the recovered address.

Ensure to run tests after every function implementation.
