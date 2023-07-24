# Commands

Create a new claim topic

```bash
npx hardhat --network sepolia add-claim-topic --symbol TOKEN --topic 1
```

Create a new trusted issuer

```bash
npx hardhat --network sepolia add-trusted-issuer --symbol TOKEN --trustedissuer 0x3AAF0e6023A2745FB62052c1954260559fFF4947 --claimtopics 1
```

Create a new identity

```bash
npx hardhat --network sepolia add-identity --symbol TOKEN --identity 0x89300Fd324F1355BEfD76827304D61EFCaE188bd
```

Add a new claim

```bash
npx hardhat --network sepolia add-claim --symbol TOKEN --identity 0x7Ba077c83de41731C1f8732cBF76d7CC2d222d0b --claimtopic 1 --claim 0
```

List all claim topics

```bash
npx hardhat --network sepolia claim-topics --symbol TOKEN
```

List all trusted issuers

```bash
npx hardhat --network sepolia trusted-issuers --symbol TOKEN
```

List all identities

```bash
npx hardhat --network sepolia identities --symbol TOKEN
```
