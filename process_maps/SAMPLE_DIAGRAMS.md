# Sample Diagrams for Process Maps Module

## Marketing Process - Lead Generation & Conversion

### Mermaid Diagram Data
Copy this into the "Diagram Data" field when creating a process map:

```mermaid
graph TD
    A[Marketing Campaign Launch] --> B[Content Creation]
    B --> C[Content Distribution]
    C --> D{Channel Selection}
    D -->|Social Media| E[Post on Platforms]
    D -->|Email| F[Send Email Campaign]
    D -->|SEO| G[Optimize Content]
    E --> H[Monitor Engagement]
    F --> H
    G --> H
    H --> I{Lead Generated?}
    I -->|Yes| J[Qualify Lead]
    I -->|No| K[Analyze & Optimize]
    K --> B
    J --> L{Lead Quality}
    L -->|Hot Lead| M[Assign to Sales]
    L -->|Warm Lead| N[Nurture Campaign]
    L -->|Cold Lead| O[Add to Newsletter]
    M --> P[Sales Follow-up]
    N --> Q[Follow-up Email]
    O --> R[Monthly Newsletter]
    P --> S{Converted?}
    Q --> S
    S -->|Yes| T[Customer Onboarding]
    S -->|No| U[Update CRM]
    T --> V[Success!]
    U --> K
```

### Alternative: Simple Marketing Workflow

```mermaid
flowchart LR
    A[Start Campaign] --> B[Create Content]
    B --> C[Publish]
    C --> D[Track Metrics]
    D --> E{Goals Met?}
    E -->|Yes| F[Scale Campaign]
    E -->|No| G[Optimize]
    G --> B
    F --> H[End]
```

### Marketing Campaign Planning Process

```mermaid
graph TB
    Start([Campaign Planning Starts]) --> Define[Define Objectives]
    Define --> Budget[Set Budget]
    Budget --> Target[Identify Target Audience]
    Target --> Strategy[Develop Strategy]
    Strategy --> Content[Create Content Plan]
    Content --> Timeline[Set Timeline]
    Timeline --> Approve{Approval}
    Approve -->|Rejected| Strategy
    Approve -->|Approved| Execute[Execute Campaign]
    Execute --> Monitor[Monitor Performance]
    Monitor --> Analyze[Analyze Results]
    Analyze --> Report[Generate Report]
    Report --> Review{Review Meeting}
    Review -->|Success| End([Campaign Complete])
    Review -->|Needs Improvement| Strategy
```

## How to Use These Diagrams

1. **Create a new Process Map** in Odoo
2. **Set Diagram Type** to "Mermaid"
3. **Copy one of the diagram codes above** (without the ```mermaid wrapper)
4. **Paste into the "Diagram Data" field**
5. **Save and Publish**

## Example Process Map Setup

- **Name**: Marketing Lead Generation Process
- **Category**: Marketing
- **Version**: 1.0
- **Diagram Type**: Mermaid
- **Diagram Data**: (paste the first diagram code above)
- **Description**: This process outlines our marketing lead generation and conversion workflow from campaign launch to customer onboarding.
