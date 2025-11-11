# Feature Roadmap

**Product**: [Product Name]
**Vision Document**: [Link to product-vision.md]
**Strategic Themes**: [Link to strategic-themes.md]
**Created**: [Date]
**Author**: [Name/Team]
**Status**: [Draft/Active/Archived]
**Roadmap Timeframe**: [e.g., Q1-Q3 2025, or Month 1-6]

---

## Vision & Strategy Summary

**Vision Statement**: [1-2 sentence recap]

**Strategic Themes**: [List 3-5 themes this roadmap addresses]
1. [Theme 1] - [Brief description]
2. [Theme 2] - [Brief description]
3. [Theme 3] - [Brief description]

**Roadmap Objectives**: [What this roadmap aims to achieve]

---

## Roadmap at a Glance

### Timeline Overview

```
Phase 1: Foundation        Phase 2: Core Experience   Phase 3: Enhancement
[Month 1-2 / Q1]          [Month 3-4 / Q2]           [Month 5-6 / Q3]
├─ Epic A                 ├─ Epic D                  ├─ Epic G
├─ Epic B                 ├─ Epic E                  ├─ Epic H
└─ Epic C                 └─ Epic F                  └─ Epic I
```

### Epic Priority Matrix

| Epic | Theme | Business Value | Effort | Priority Score | Phase |
|------|-------|---------------|--------|----------------|-------|
| Epic A | Theme 1 | High | M | 9.0 | Phase 1 |
| Epic B | Theme 1 | High | S | 8.5 | Phase 1 |
| Epic C | Theme 2 | Medium | M | 6.5 | Phase 1 |
| Epic D | Theme 2 | High | L | 7.0 | Phase 2 |
| Epic E | Theme 3 | Medium | M | 5.5 | Phase 2 |

---

## Phase 1: Foundation [Month 1-2 / Q1]

### Phase Objective
[What this phase establishes - usually platform capabilities, core infrastructure, or foundational user experiences]

### Phase Success Criteria
- [Criterion 1]: [Measurable outcome]
- [Criterion 2]: [Measurable outcome]
- [Criterion 3]: [Measurable outcome]

---

### Epic A: [Epic Name]

**Strategic Theme**: [Theme this supports]

**Objective**: [What this epic achieves]

**Target Users**: [Primary persona(s) who benefit]

**Value Delivered**:
- **Business Value**: [How this drives business objectives]
- **User Value**: [How this improves user experience]

**Key Capabilities**:
1. [Capability 1] - [Description]
2. [Capability 2] - [Description]
3. [Capability 3] - [Description]
4. [Capability 4] - [Description]

**Dependencies**:
- **Technical**: [Platform, APIs, infrastructure requirements]
- **Feature**: [Other epics that must come first - or "None" for Phase 1]
- **Business**: [Go-to-market, partnerships, or other prerequisites]

**Success Metrics**:
- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

**Effort Estimate**: [T-shirt size: S/M/L/XL] | [Optional: story points or person-weeks]

**Priority Score**: [RICE/WSJF score and rationale]

**PRD Status**: [Ready/Needs refinement/Blocked]

**Proposed Timeline**: [Specific months or sprint range]

**Notes**: [Any important context, risks, or considerations]

---

### Epic B: [Epic Name]

[Repeat structure above]

---

### Epic C: [Epic Name]

[Repeat structure above]

---

## Phase 2: Core Experience [Month 3-4 / Q2]

### Phase Objective
[What this phase delivers - usually core user-facing features building on Phase 1 foundation]

### Phase Success Criteria
- [Criterion 1]: [Measurable outcome]
- [Criterion 2]: [Measurable outcome]
- [Criterion 3]: [Measurable outcome]

---

### Epic D: [Epic Name]

**Strategic Theme**: [Theme this supports]

**Objective**: [What this epic achieves]

**Target Users**: [Primary persona(s) who benefit]

**Value Delivered**:
- **Business Value**: [How this drives business objectives]
- **User Value**: [How this improves user experience]

**Key Capabilities**:
1. [Capability 1] - [Description]
2. [Capability 2] - [Description]
3. [Capability 3] - [Description]

**Dependencies**:
- **Technical**: [Platform, APIs, infrastructure requirements]
- **Feature**: [Epics from Phase 1 this depends on]
- **Business**: [Go-to-market, partnerships, or other prerequisites]

**Success Metrics**:
- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

**Effort Estimate**: [T-shirt size: S/M/L/XL]

**Priority Score**: [RICE/WSJF score and rationale]

**PRD Status**: [Ready/Needs refinement/Blocked]

**Proposed Timeline**: [Specific months or sprint range]

---

### Epic E: [Epic Name]

[Repeat structure above]

---

### Epic F: [Epic Name]

[Repeat structure above]

---

## Phase 3: Enhancement & Scale [Month 5-6 / Q3]

### Phase Objective
[What this phase optimizes - usually enhancements, scaling, or advanced features]

### Phase Success Criteria
- [Criterion 1]: [Measurable outcome]
- [Criterion 2]: [Measurable outcome]

---

### Epic G: [Epic Name]

[Follow same epic structure as above]

---

### Epic H: [Epic Name]

[Follow same epic structure as above]

---

## Dependency Map

### Visual Dependency Graph

```
Phase 1 (Foundation)          Phase 2 (Core Experience)    Phase 3 (Enhancement)
       ↓                              ↓                            ↓
   Epic A  ────────────────→  Epic D  ─────────────→  Epic G
       ↓                          ↓
   Epic B  ────────┐              ↓
       ↓           └──────→  Epic E  ─────────────→  Epic H
   Epic C  ────────────────→  Epic F  ─────────────→  Epic I
```

### Dependency Details

| Epic | Depends On | Enables | Blocking Issues |
|------|-----------|---------|----------------|
| Epic A | None (Foundation) | Epic D, Epic E | None |
| Epic B | None (Foundation) | Epic E | None |
| Epic C | None (Foundation) | Epic D, Epic F | None |
| Epic D | Epic A, Epic C | Epic G | [If any] |
| Epic E | Epic A, Epic B | Epic H | [If any] |

### Critical Path
[Identify the sequence of epics that determines minimum timeline]

1. Epic A → Epic D → Epic G (Critical path - [X] months)
2. Epic C → Epic F → Epic I (Parallel track - [Y] months)

---

## Prioritization Framework

### Scoring Method Used
[RICE / WSJF / Value vs Effort / Custom]

#### RICE Scoring Details (if used)

| Epic | Reach | Impact | Confidence | Effort | Score |
|------|-------|--------|-----------|--------|-------|
| Epic A | 1000 | 3 | 80% | 2 | 1200 |
| Epic B | 500 | 2 | 90% | 1 | 900 |

#### Value vs Effort Matrix (if used)

```
High Value │ Epic B        │ Epic A, Epic D │
           │ (Quick Win)   │ (Strategic)    │
           │───────────────┼────────────────│
Low Value  │ Epic F        │ Epic E         │
           │ (Fill-in)     │ (Avoid?)       │
           └───────────────┴────────────────┘
             Low Effort      High Effort
```

### Prioritization Rationale

**Why Epic A is Priority 1**:
- [Reason 1: Business impact]
- [Reason 2: User value]
- [Reason 3: Technical foundation]

**Why Epic B is Priority 2**:
- [Rationale]

[Continue for top 3-5 priorities]

---

## Theme Coverage

### Theme 1: [Theme Name]
**Epics**: [Epic A, Epic B, Epic D]
**Phase Distribution**:
- Phase 1: 2 epics (Epic A, Epic B)
- Phase 2: 1 epic (Epic D)
- Phase 3: 0 epics

**Theme Progress**: [How these epics advance the theme objective]

### Theme 2: [Theme Name]
**Epics**: [Epic C, Epic E, Epic F]
**Phase Distribution**:
- Phase 1: 1 epic (Epic C)
- Phase 2: 2 epics (Epic E, Epic F)
- Phase 3: 0 epics

---

## MVP & Phased Rollout Strategy

### Minimum Viable Product (MVP)
**Scope**: [Which epics constitute the MVP]
- Epic A: [Essential capability]
- Epic B: [Essential capability]

**MVP Success Criteria**: [What validates MVP]

**MVP Timeline**: [When MVP should be ready]

### Phased Rollout Plan

**Alpha** (Internal):
- **Scope**: [Which epics or capabilities]
- **Users**: [Internal team, select partners]
- **Timeline**: [When]
- **Success Criteria**: [What we're validating]

**Beta** (Limited):
- **Scope**: [Additional epics]
- **Users**: [Early adopters, select customers]
- **Timeline**: [When]
- **Success Criteria**: [What we're validating]

**General Availability** (GA):
- **Scope**: [All Phase 1-2 epics]
- **Users**: [All target users]
- **Timeline**: [When]
- **Success Criteria**: [What we're measuring]

---

## Cross-Cutting Capabilities

[Capabilities needed across multiple epics that should be prioritized]

### [Capability Name]
- **Supports**: [Epic A, Epic C, Epic D]
- **Description**: [What this provides]
- **Owner**: [Which epic should implement this]
- **Priority**: [When to build - Phase 1/2/3]
- **Effort**: [Size estimate]

### [Capability Name]
[Repeat structure above]

---

## Success Metrics & OKRs

### Roadmap-Level Success Metrics

| Metric | Baseline | Phase 1 Target | Phase 2 Target | Phase 3 Target |
|--------|----------|---------------|----------------|----------------|
| [KPI 1] | [Current] | [Target] | [Target] | [Target] |
| [KPI 2] | [Current] | [Target] | [Target] | [Target] |
| [KPI 3] | [Current] | [Target] | [Target] | [Target] |

### Roadmap OKRs

**Objective 1**: [Qualitative goal for Phases 1-2]
- **KR1**: [Measurable result]
- **KR2**: [Measurable result]
- **KR3**: [Measurable result]

**Objective 2**: [Qualitative goal for Phase 3]
- **KR1**: [Measurable result]
- **KR2**: [Measurable result]

---

## Risks & Mitigation

### Technical Risks

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|-----------|-------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] | [Name] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Strategy] | [Name] |

### Business Risks

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|-----------|-------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] | [Name] |

---

## PRD Generation Plan

### PRDs Ready to Create (Priority Order)

1. **Epic A: [Epic Name]**
   - **Owner**: [tactical-product-manager]
   - **Target Start**: [Date/Sprint]
   - **Strategic Context**: [Link to theme, key priorities]
   - **Success Metrics**: [From epic definition]

2. **Epic B: [Epic Name]**
   - [Same structure]

3. **Epic C: [Epic Name]**
   - [Same structure]

### PRDs Needing Refinement

- **Epic E**: [What needs to be clarified before PRD]
- **Epic H**: [What needs to be validated before PRD]

---

## Stakeholder Communication

### Key Messages by Audience

**Executive Leadership**:
- [Message 1]: [Focus on business outcomes]
- [Message 2]: [Resource requirements]
- [Timeline]: [Key milestones]

**Engineering Teams**:
- [Message 1]: [Technical dependencies]
- [Message 2]: [Architecture implications]
- [Timeline]: [Phase planning]

**Go-to-Market Teams**:
- [Message 1]: [Feature availability]
- [Message 2]: [Positioning and messaging]
- [Timeline]: [Launch planning]

### Review & Approval Status

| Stakeholder | Role | Status | Feedback | Date |
|-------------|------|--------|----------|------|
| [Name] | [Role] | [Approved/Review/Pending] | [Comments] | [Date] |

---

## Roadmap Flexibility & Adaptation

### Built-in Flexibility
[How we'll adapt based on learning]

- **After Phase 1**: [Decision points or potential pivots]
- **After Phase 2**: [Potential scope adjustments]
- **Quarterly Reviews**: [When we reassess priorities]

### Scenarios for Roadmap Changes

**If MVP validation fails**:
- [How we'd adjust roadmap]

**If resource constraints change**:
- [What we'd descope or defer]

**If competitive landscape shifts**:
- [How we'd reprioritize]

---

## Next Actions

### Immediate (This Week)
1. [ ] Review roadmap with key stakeholders
2. [ ] Validate technical feasibility of Phase 1 epics
3. [ ] Begin PRD creation for Epic A with tactical-product-manager

### Short-term (This Month)
1. [ ] Complete PRDs for all Phase 1 epics
2. [ ] Validate dependencies and sequencing
3. [ ] Begin Phase 1 implementation

### Medium-term (This Quarter)
1. [ ] Complete Phase 1 delivery
2. [ ] Validate key assumptions
3. [ ] Refine Phase 2 based on learning

---

## Appendix

### Related Documents
- [Link to product vision document]
- [Link to strategic themes document]
- [Link to user research]
- [Link to technical architecture]
- [Link to competitive analysis]

### Roadmap Assumptions
1. [Assumption 1]: [What we're assuming is true]
2. [Assumption 2]: [What we're assuming about resources]
3. [Assumption 3]: [What we're assuming about market]

### Change Log

| Date | Version | Changes | Author | Approver |
|------|---------|---------|--------|----------|
| [Date] | 1.0 | Initial roadmap | [Name] | [Name] |

---

**Document History**

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| [Date] | 1.0 | Initial roadmap from themes | [Name] |
