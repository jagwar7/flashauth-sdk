## FlashAuth Authentication Flow

```mermaid
flowchart TD
    A[User Triggers Auth in React App<br/>(e.g., Login Button)] --> B[FlashAuth SDK Captures Credentials<br/>(Email/Password or OAuth Token)]
    B --> C[SDK Sends Encrypted Request to FlashAuth Backend]
    C --> D[Backend Verifies Credentials<br/>(Custom Logic + Security Checks)]
    D --> E{Valid?}
    E -->|No| F[Error: Reject Auth<br/>(e.g., Invalid Credentials)]
    E -->|Yes| G[Create/Update User in Database]
    G --> H[Backend Sends Callback to App<br/>(Update Auth State)]
    H --> I[User Logged In!<br/>(Redirect/Unlock Features)]
    F --> I[Optional: Retry Flow]
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style F fill:#ffcdd2