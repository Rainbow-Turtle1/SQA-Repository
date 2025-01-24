# SQA Assignment 


## Feature Implementation
| Feature  | Owner |
| ------------- |:-------------:|
| Blog Post Management: Implement features to search or sort blog posts effectively      | Nathan Voong     |
| User Profiles: Allow users to create, edit, delete, and view their profile details      | Asher De Souza     |
| Access Control: Restrict editing and deleting posts to their respective authors      | Arran McPherson     |
| User Authentication: Enable user registration and login functionality   | Isabella Sulisufi    |

## Testing
### Behaviour Driven Development
We decided not to follow a TDD approach because we were still in the process of defining the application's scope and determining which features to prioritise. Without a clear roadmap of all the functionalities, writing precise tests before implementation felt impractical.

Instead, we adopted BDD, which allowed us to write tests based on how the application should behave from a user's perspective. This approach provided us the flexibility to iterate on features while still ensuring that the core functionalities met our expectations.

Our tests are structured to validate the application's behavior, as seen in the example below:  

```javascript
describe("GET /", () => {
  it("should ..test scenario", async () => {
  })
});
```

With this format, we validate both the HTTP response status and the presence of key elements on the page, ensuring that the user experience aligns with our expectations. By using BDD, we were able to remain adaptable while still maintaining confidence in our application's functionality.


### Evidence of running tests
### Evidence of achieveing the coverage report
### How edge cases and error conditions were tested

## Security Enhancements
### Input Validation
### CSRF Protection
### Safeguards against XSS and SQL injection

### Password Hashing
We decided not to encrypt passwords as it relies on an encryption key to decrypt the data back into its original form. Even if we store this key securely in environment variables, there's still a risk: if someone gains access to the key, they could decrypt and expose all stored passwords.

We decided to hash the passwords using [bcrypt](https://www.npmjs.com/package/bcryptjs). Hashing is a one-way operation, meaning once a password is hashed, it cannot be reversed back to its original form.
When users register, their password is hashed and stored in the database. During login, the input password is hashed again and compared to the stored hash, ensuring the original password is never stored or exposed.

However, even hashing can cause hash collisions. If two users set the same password, they would have the same hash. Additionally, precomputed hash tables (rainbow tables) exist online for common passwords, making it easier for attackers to crack weak hashes.

To address this limitation, we added salting to our password hashing process. Each password is hashed with a unique, random salt, ensuring even identical passwords produce unique hashes, effectively preventing rainbow table attacks.

#### Implementation Details
**Registration**: Passwords are hashed with bcrypt using a salt round of 10
`(bcrypt.hash(password, 10))`
before being stored.

**Login**: User-entered passwords are compared securely using bcrypt.compare, ensuring the plain text password never touches our database.

#### Example picture of database where password entered was 123 and it shows the hashed password

![image of the database showing a users password being hashed](/public/resources/readme-assets/exampledatabasehashing.png)


By using hashing with salting, we've significantly enhanced our password security. Users’ credentials are better protected against common attacks like rainbow table lookups and hash collisions, ensuring that their sensitive information remains confidential even in the event of a database breach.
### CSRF Protection 
### Input Validation
### Any additional configurations or tools used

## Code Quality and Refactoring
### Sections of the code demonstrating modularisation
### Key improvements made during refactoring
### 
## CI/CD and Git Practices

### GitHub Actions Used
#### Linting Code
To maintain consistent code standards and ensure our codebase remains clean and tidy, we implemented a GitHub Action specifically for linting. For this, we used ESLint along with a custom configuration file tailored to our project requirements.

The linting action is triggered automatically on both pull requests and direct pushes to the master branch, helping to catch issues early and streamline the code review process.
We opted for ESLint due to its flexibility and wide adoption within the JavaScript ecosystem.

#### Testing
We streamlined the CI process by automating functionality tests. This workflow triggers whenever changes are pushed or when pull requests are created. This provides rapid feedback on code changes, allowing us to catch errors early and fix them before they reach production. This in turn reduces manual effort and human error, as every change is thoroughly tested without requiring developer intervention. It also ensures consistent testing environments and accelerates the development workflow by integrating caching mechanisms for dependencies to improve efficiency. 

### How we colllaborated
