# Pricing Engine & ROI Logic

## Automation Score Formula
The engine calculates an "Automation Score" (0-100) based on:
1.  **Tech Stack Maturity:** Existing APIs (HubSpot = High, Excel = Low).
2.  **Process Repetition:** High frequency + Low complexity = High Score.

## ROI Calculation
The chart in `ReportView` is generated using:

```typescript
const hourlyRate = client_input.hourlyRate; // e.g., $50/hr
const manualHours = client_input.manualHours; // e.g., 20hrs/week

const monthlyManualCost = hourlyRate * manualHours * 4;

// AI Estimate based on Industry Benchmarks
const reductionFactor = 0.8; // 80% reduction for simple data entry tasks
const implementationCost = 5000; // One-time setup
const maintenanceCost = 200; // Monthly SaaS costs

const automatedMonthlyCost = (monthlyManualCost * (1 - reductionFactor)) + maintenanceCost;

// Chart Data Generation
// Month 0: manualCost
// Month 1: manualCost (Implementation phase)
// Month 2: automatedMonthlyCost
// ...
```

## Urgency Multiplier (US4.2)
If `pain_points` includes "Lost Revenue" or "Compliance Risk", the quote generation applies a `1.2x` multiplier to the base service fee, reflecting the high value of solving the problem immediately.