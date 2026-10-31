const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

async function createReviewPPT() {
  const pres = new pptxgen();
  
  // Set layout to 16:9 Widescreen (10 x 5.625 inches)
  pres.layout = 'LAYOUT_16x9';

  // Palette definition
  const C_WHITE = 'FFFFFF';
  const C_BLACK = '000000';
  const C_DARK_TITLE = '111827';
  const C_TEXT = '1F2937';
  const C_MUTED = '4B5563';
  const C_KL_RED = 'B31B1B';
  const C_NAVY = '1E3A8A';
  const C_CARD_BG = 'F8FAFC';
  const C_CARD_BORDER = 'E2E8F0';
  const C_ACCENT_BLUE = '0284C7';
  const C_ACCENT_GREEN = '15803D';
  const C_FOOTER_GRAY = '6B7280';
  const C_LINE_GRAY = 'D1D5DB';

  const TOTAL_SLIDES = 12;

  // Helper to add standard header and footer to a slide
  function applySlideTemplate(slide, slideTitle, slideIndex, subtitle = '') {
    // Top-Left Logo / Crest
    if (fs.existsSync(path.join(__dirname, 'kl_logo.svg'))) {
      slide.addImage({
        path: path.join(__dirname, 'kl_logo.svg'),
        x: 0.4,
        y: 0.25,
        w: 1.5,
        h: 0.45
      });
    } else {
      slide.addText('KL', {
        x: 0.4,
        y: 0.25,
        w: 1.5,
        h: 0.45,
        fontFace: 'Calibri',
        fontSize: 22,
        bold: true,
        color: C_KL_RED
      });
    }

    // Slide Title (Centered, 28-32pt Bold Calibri as per template)
    slide.addText(slideTitle, {
      x: 1.8,
      y: 0.22,
      w: 7.8,
      h: 0.55,
      fontFace: 'Calibri',
      fontSize: 28,
      bold: true,
      color: C_DARK_TITLE,
      align: 'center',
      valign: 'middle'
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: 1.8,
        y: 0.72,
        w: 7.8,
        h: 0.28,
        fontFace: 'Calibri',
        fontSize: 16,
        bold: true,
        color: C_KL_RED,
        align: 'center'
      });
    }

    // Top Divider Line
    slide.addShape(pres.ShapeType.line, {
      x: 0.4,
      y: subtitle ? 0.98 : 0.82,
      w: 9.2,
      h: 0,
      line: { color: C_LINE_GRAY, width: 1.2 }
    });

    // Bottom Footer Line
    slide.addShape(pres.ShapeType.line, {
      x: 0.4,
      y: 5.15,
      w: 9.2,
      h: 0,
      line: { color: C_LINE_GRAY, width: 1.0 }
    });

    // Footer items: Date, Review-II, Department of CSE-2, Slide Number
    slide.addText('21-09-2026', {
      x: 0.4,
      y: 5.22,
      w: 2.0,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C_FOOTER_GRAY,
      align: 'left'
    });

    slide.addText('Review-II', {
      x: 3.5,
      y: 5.22,
      w: 3.0,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C_FOOTER_GRAY,
      align: 'center'
    });

    slide.addText('Department of CSE-2', {
      x: 6.8,
      y: 5.22,
      w: 2.2,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C_FOOTER_GRAY,
      align: 'right'
    });

    slide.addText(String(slideIndex), {
      x: 9.1,
      y: 5.22,
      w: 0.5,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 12,
      color: C_FOOTER_GRAY,
      align: 'right'
    });
  }

  // ==========================================
  // SLIDE 1: TITLE SLIDE (REVIEW-II)
  // ==========================================
  {
    const s1 = pres.addSlide();
    
    // Header
    s1.addText('REVIEW-II', {
      x: 1.0,
      y: 0.4,
      w: 8.0,
      h: 0.45,
      fontFace: 'Calibri',
      fontSize: 26,
      bold: true,
      color: C_DARK_TITLE,
      align: 'center'
    });

    // Project Title
    s1.addText('Cloud-Native API Gateway and Service Mesh Architecture', {
      x: 0.5,
      y: 0.95,
      w: 9.0,
      h: 0.85,
      fontFace: 'Calibri',
      fontSize: 26,
      bold: true,
      color: C_NAVY,
      align: 'center'
    });

    // Subtitle
    s1.addText('Secure, Scalable and Observable Microservices Infrastructure', {
      x: 0.5,
      y: 1.75,
      w: 9.0,
      h: 0.35,
      fontFace: 'Calibri',
      fontSize: 18,
      italic: true,
      bold: true,
      color: C_ACCENT_BLUE,
      align: 'center'
    });

    // Divider
    s1.addShape(pres.ShapeType.line, {
      x: 1.5,
      y: 2.15,
      w: 7.0,
      h: 0,
      line: { color: C_LINE_GRAY, width: 1.2 }
    });

    // Team Card (Left)
    s1.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 2.3,
      w: 4.2,
      h: 1.85,
      rectRadius: 0.1,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s1.addText('PROJECT TEAM MEMBERS', {
      x: 0.7,
      y: 2.38,
      w: 4.0,
      h: 0.28,
      fontFace: 'Calibri',
      fontSize: 14,
      bold: true,
      color: C_KL_RED,
      align: 'left'
    });

    const teamText = [
      { text: '• Bandaru Sai Venkat Ram', options: { bold: true, fontSize: 13, color: C_TEXT } },
      { text: '  (2300031764)\n', options: { fontSize: 12, color: C_MUTED } },
      { text: '• Davuluri Bala Gopal', options: { bold: true, fontSize: 13, color: C_TEXT } },
      { text: '  (2300032878)\n', options: { fontSize: 12, color: C_MUTED } },
      { text: '• Akaramsetty Siva Sai', options: { bold: true, fontSize: 13, color: C_TEXT } },
      { text: '  (2300033233)\n', options: { fontSize: 12, color: C_MUTED } },
      { text: '• Rohid Baig', options: { bold: true, fontSize: 13, color: C_TEXT } },
      { text: '  (2300039146)', options: { fontSize: 12, color: C_MUTED } }
    ];
    s1.addText(teamText, {
      x: 0.7,
      y: 2.7,
      w: 4.0,
      h: 1.4,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 16
    });

    // Guidance Card (Right)
    s1.addShape(pres.ShapeType.roundRect, {
      x: 5.2,
      y: 2.3,
      w: 4.2,
      h: 1.85,
      rectRadius: 0.1,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s1.addText('UNDER THE GUIDANCE OF', {
      x: 5.3,
      y: 2.38,
      w: 4.0,
      h: 0.28,
      fontFace: 'Calibri',
      fontSize: 14,
      bold: true,
      color: C_KL_RED,
      align: 'left'
    });

    const guideText = [
      { text: 'Mr. BVN Prasad Paruchuri\n', options: { bold: true, fontSize: 15, color: C_TEXT } },
      { text: 'Assistant Professor\n', options: { fontSize: 13, color: C_MUTED } },
      { text: 'Department of Computer Science & Engineering\n', options: { fontSize: 13, color: C_MUTED } },
      { text: 'Program: B.Tech — Cloud Native Software Engg.\n', options: { fontSize: 12, color: C_ACCENT_BLUE } },
      { text: 'Academic Year: 2025 – 2026', options: { fontSize: 12, color: C_MUTED } }
    ];
    s1.addText(guideText, {
      x: 5.3,
      y: 2.7,
      w: 4.0,
      h: 1.4,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 18
    });

    // Institution Logo & Name Center Bottom
    if (fs.existsSync(path.join(__dirname, 'kl_logo.svg'))) {
      s1.addImage({
        path: path.join(__dirname, 'kl_logo.svg'),
        x: 4.1,
        y: 4.3,
        w: 1.8,
        h: 0.5
      });
    }

    s1.addText('KONERU LAKSHMAIAH EDUCATION FOUNDATION', {
      x: 1.0,
      y: 4.82,
      w: 8.0,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 14,
      bold: true,
      color: C_KL_RED,
      align: 'center'
    });

    // Footer line
    s1.addShape(pres.ShapeType.line, {
      x: 0.4,
      y: 5.15,
      w: 9.2,
      h: 0,
      line: { color: C_LINE_GRAY, width: 1.0 }
    });

    s1.addText('21-09-2026', { x: 0.4, y: 5.22, w: 2.0, h: 0.3, fontFace: 'Calibri', fontSize: 12, color: C_FOOTER_GRAY });
    s1.addText('Review-II', { x: 3.5, y: 5.22, w: 3.0, h: 0.3, fontFace: 'Calibri', fontSize: 12, color: C_FOOTER_GRAY, align: 'center' });
    s1.addText('Department of CSE-2', { x: 6.8, y: 5.22, w: 2.2, h: 0.3, fontFace: 'Calibri', fontSize: 12, color: C_FOOTER_GRAY, align: 'right' });
    s1.addText('1', { x: 9.1, y: 5.22, w: 0.5, h: 0.3, fontFace: 'Calibri', fontSize: 12, color: C_FOOTER_GRAY, align: 'right' });
  }

  // ==========================================
  // SLIDE 2: OUTLINE
  // ==========================================
  {
    const s2 = pres.addSlide();
    applySlideTemplate(s2, 'OUTLINE', 2);

    const outlineItems = [
      { num: '1.', title: 'Introduction' },
      { num: '2.', title: 'Problem Statement and Objectives' },
      { num: '3.', title: 'Functional & Non-Functional Requirements', sub: '• Functional & Non-Functional Requirements  |  • Requirement Traceability' },
      { num: '4.', title: 'Alternative Solutions & Trade-off Analysis' },
      { num: '5.', title: 'Complete System Architecture', sub: '• Architecture Diagram  |  • Technology Stack  |  • Design Rationale' },
      { num: '6.', title: 'Detailed Design & Data Flow' },
      { num: '7.', title: 'Implementation & Unit-Level Progress' },
      { num: '8.', title: 'Testing & Results' },
      { num: '9.', title: 'Conclusion & Future Scope' }
    ];

    // 2-column or list layout for outline
    const leftItems = [
      '1.   Introduction',
      '2.   Problem Statement and Objectives',
      '3.   Functional & Non-Functional Requirements\n       • Functional & Non-Functional Requirements\n       • Requirement Traceability / Acceptance Criteria',
      '4.   Alternative Solutions & Trade-off Analysis',
      '5.   Complete System Architecture\n       • Architecture Diagram  |  • Technology Stack  |  • Design Rationale'
    ];

    const rightItems = [
      '6.   Detailed Design & Data Flow',
      '7.   Implementation & Unit-Level Progress',
      '8.   Testing & Results',
      '9.   Conclusion & Future Scope'
    ];

    s2.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.05,
      w: 4.3,
      h: 3.9,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s2.addText(leftItems.join('\n\n'), {
      x: 0.8,
      y: 1.2,
      w: 3.9,
      h: 3.6,
      fontFace: 'Calibri',
      fontSize: 22,
      bold: false,
      color: C_TEXT,
      valign: 'top',
      lineSpacing: 26
    });

    s2.addShape(pres.ShapeType.roundRect, {
      x: 5.1,
      y: 1.05,
      w: 4.3,
      h: 3.9,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s2.addText(rightItems.join('\n\n\n'), {
      x: 5.3,
      y: 1.35,
      w: 3.9,
      h: 3.4,
      fontFace: 'Calibri',
      fontSize: 22,
      bold: false,
      color: C_TEXT,
      valign: 'top',
      lineSpacing: 28
    });
  }

  // ==========================================
  // SLIDE 3: INTRODUCTION
  // ==========================================
  {
    const s3 = pres.addSlide();
    applySlideTemplate(s3, 'INTRODUCTION', 3);

    const bullets = [
      { text: '• Paradigm Shift to Cloud-Native: ', options: { bold: true, color: C_KL_RED, fontSize: 24 } },
      { text: 'Transitioning airline booking systems from monolithic models to decoupled, resilient microservices.\n\n', options: { color: C_TEXT, fontSize: 24 } },

      { text: '• Unified API Gateway Ingress: ', options: { bold: true, color: C_NAVY, fontSize: 24 } },
      { text: 'Single entry point enforcing edge authentication, dynamic routing, token-bucket rate limiting, and SSL termination.\n\n', options: { color: C_TEXT, fontSize: 24 } },

      { text: '• Istio Service Mesh & Zero-Trust: ', options: { bold: true, color: C_KL_RED, fontSize: 24 } },
      { text: 'Securing east-west service communications transparently with STRICT mutual TLS (mTLS) and Envoy sidecars.\n\n', options: { color: C_TEXT, fontSize: 24 } },

      { text: '• Traffic Governance & Resilience: ', options: { bold: true, color: C_NAVY, fontSize: 24 } },
      { text: 'Enabling intelligent canary traffic shifting (90/10), circuit breaking, automated retries, and fault injection.\n\n', options: { color: C_TEXT, fontSize: 24 } },

      { text: '• Full-Stack Telemetry & Tracing: ', options: { bold: true, color: C_KL_RED, fontSize: 24 } },
      { text: 'End-to-end distributed observability leveraging Prometheus, Grafana, Loki, and Tempo for high availability.', options: { color: C_TEXT, fontSize: 24 } }
    ];

    s3.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.05,
      w: 8.8,
      h: 3.95,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s3.addText(bullets, {
      x: 0.9,
      y: 1.2,
      w: 8.2,
      h: 3.65,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 28
    });
  }

  // ==========================================
  // SLIDE 4: PROBLEM STATEMENT & OBJECTIVES
  // ==========================================
  {
    const s4 = pres.addSlide();
    applySlideTemplate(s4, 'PROBLEM STATEMENT & OBJECTIVES', 4);

    // Problem Statement Box
    s4.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.0,
      w: 8.8,
      h: 1.25,
      rectRadius: 0.08,
      fill: { color: 'FEF2F2' },
      line: { color: 'FECACA', width: 1.2 }
    });

    s4.addText('PROBLEM STATEMENT', {
      x: 0.8,
      y: 1.08,
      w: 8.4,
      h: 0.25,
      fontFace: 'Calibri',
      fontSize: 16,
      bold: true,
      color: C_KL_RED
    });

    s4.addText([
      { text: '• Monolithic airline booking systems suffer from ', options: { fontSize: 22, color: C_TEXT } },
      { text: 'single points of failure, tight coupling,', options: { bold: true, fontSize: 22, color: C_KL_RED } },
      { text: ' and scalability bottlenecks during traffic surges.\n', options: { fontSize: 22, color: C_TEXT } },
      { text: '• Lack of ', options: { fontSize: 22, color: C_TEXT } },
      { text: 'zero-trust security (mTLS)', options: { bold: true, fontSize: 22, color: C_NAVY } },
      { text: ' and unified observability in inter-service communications leads to cascading outages.', options: { fontSize: 22, color: C_TEXT } }
    ], {
      x: 0.8,
      y: 1.35,
      w: 8.4,
      h: 0.82,
      fontFace: 'Calibri',
      valign: 'top'
    });

    // Objectives Box (Max 4 Objectives)
    s4.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 2.38,
      w: 8.8,
      h: 2.65,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1.2 }
    });

    s4.addText('PROJECT OBJECTIVES (MAXIMUM 4)', {
      x: 0.8,
      y: 2.45,
      w: 8.4,
      h: 0.25,
      fontFace: 'Calibri',
      fontSize: 16,
      bold: true,
      color: C_NAVY
    });

    const objectives = [
      { text: '1. Cloud-Native API Gateway: ', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: 'Deploy an edge gateway for intelligent routing, persona access, and rate limiting.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '2. Istio Service Mesh Security: ', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: 'Implement strict mTLS encryption, circuit breakers, and canary traffic splitting (90/10).\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '3. Intelligent Microservices Core: ', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: 'Engineer decoupled Spring Boot services, 3D seat mapping, and FastAPI AI assistant.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '4. Full-Stack Observability Pipeline: ', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: 'Integrate Prometheus, Grafana, Loki, and Tempo for distributed tracing and health monitoring.', options: { color: C_TEXT, fontSize: 22 } }
    ];

    s4.addText(objectives, {
      x: 0.8,
      y: 2.75,
      w: 8.4,
      h: 2.2,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 24
    });
  }

  // ==========================================
  // SLIDE 5: FUNCTIONAL & NON-FUNCTIONAL REQUIREMENTS
  // ==========================================
  {
    const s5 = pres.addSlide();
    applySlideTemplate(s5, 'FUNCTIONAL & NON-FUNCTIONAL REQUIREMENTS', 5);

    // Left Column: Functional Requirements
    s5.addShape(pres.ShapeType.roundRect, {
      x: 0.5,
      y: 1.0,
      w: 4.4,
      h: 3.95,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s5.addText('FUNCTIONAL REQUIREMENTS', {
      x: 0.7,
      y: 1.1,
      w: 4.0,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 16,
      bold: true,
      color: C_NAVY
    });

    const frText = [
      { text: '• Multi-Persona Access:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Dedicated dashboards for Passenger, Manager, and Admin workflows.\n\n', options: { color: C_TEXT, fontSize: 22 } },
      
      { text: '• 3D Interactive Seat Allocation:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  Real-time cabin visualizer with First, Business, and Economy tiering.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Conversational AI Assistant:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Natural language queries for flight discovery, policies, and baggage rules.', options: { color: C_TEXT, fontSize: 22 } }
    ];

    s5.addText(frText, {
      x: 0.7,
      y: 1.45,
      w: 4.0,
      h: 3.4,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 22
    });

    // Right Column: Non-Functional & Traceability
    s5.addShape(pres.ShapeType.roundRect, {
      x: 5.1,
      y: 1.0,
      w: 4.4,
      h: 3.95,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s5.addText('NON-FUNCTIONAL & TRACEABILITY', {
      x: 5.3,
      y: 1.1,
      w: 4.0,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 16,
      bold: true,
      color: C_KL_RED
    });

    const nfrText = [
      { text: '• Zero-Trust Security:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  100% strict mTLS encryption with automated certificate rotation.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• High Scalability & Low Latency:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Sub-100ms API response time with Redis caching and Kafka streaming.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Traceability & Acceptance:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  Zero data loss during failover; 99.9% uptime verified under load tests.', options: { color: C_TEXT, fontSize: 22 } }
    ];

    s5.addText(nfrText, {
      x: 5.3,
      y: 1.45,
      w: 4.0,
      h: 3.4,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 22
    });
  }

  // ==========================================
  // SLIDE 6: ALTERNATIVE SOLUTIONS & TRADE-OFF ANALYSIS
  // ==========================================
  {
    const s6 = pres.addSlide();
    applySlideTemplate(s6, 'ALTERNATIVE SOLUTIONS & TRADE-OFF ANALYSIS', 6, 'Data Required & Architectural Trade-offs');

    // Trade-off Table
    const tableHeaders = [
      { text: 'Evaluation Dimension', options: { bold: true, color: C_WHITE, fill: { color: C_NAVY }, align: 'center', fontSize: 13 } },
      { text: 'Monolithic Architecture', options: { bold: true, color: C_WHITE, fill: { color: '475569' }, align: 'center', fontSize: 13 } },
      { text: 'Basic Microservices', options: { bold: true, color: C_WHITE, fill: { color: '475569' }, align: 'center', fontSize: 13 } },
      { text: 'Proposed: Gateway + Istio Mesh', options: { bold: true, color: C_WHITE, fill: { color: C_KL_RED }, align: 'center', fontSize: 13 } }
    ];

    const tableRows = [
      [
        { text: 'Inter-Service Security', options: { bold: true, fontSize: 12 } },
        { text: 'Perimeter only; Plaintext inside', options: { fontSize: 12 } },
        { text: 'Custom JWT / Manual app code', options: { fontSize: 12 } },
        { text: 'Zero-Trust STRICT mTLS (Automated)', options: { bold: true, color: C_ACCENT_GREEN, fontSize: 12 } }
      ],
      [
        { text: 'Traffic & Canary Routing', options: { bold: true, fontSize: 12 } },
        { text: 'All-or-nothing redeployment', options: { fontSize: 12 } },
        { text: 'Complex custom reverse proxies', options: { fontSize: 12 } },
        { text: 'Dynamic 90/10 Canary Split & Retries', options: { bold: true, color: C_ACCENT_GREEN, fontSize: 12 } }
      ],
      [
        { text: 'Fault Resilience', options: { bold: true, fontSize: 12 } },
        { text: 'Single Point of Failure (SPoF)', options: { fontSize: 12 } },
        { text: 'Hardcoded Hystrix/Resilience4j', options: { fontSize: 12 } },
        { text: 'Envoy Circuit Breakers (3-strike ejection)', options: { bold: true, color: C_ACCENT_GREEN, fontSize: 12 } }
      ],
      [
        { text: 'Observability & Traces', options: { bold: true, fontSize: 12 } },
        { text: 'Siloed monolithic server logs', options: { fontSize: 12 } },
        { text: 'Fragmented log aggregation', options: { fontSize: 12 } },
        { text: 'Full Mesh Tracing (Prometheus+Tempo)', options: { bold: true, color: C_ACCENT_GREEN, fontSize: 12 } }
      ],
      [
        { text: 'Network Latency Overhead', options: { bold: true, fontSize: 12 } },
        { text: 'Near zero (In-memory calls)', options: { fontSize: 12 } },
        { text: 'Low (~1-2ms HTTP hops)', options: { fontSize: 12 } },
        { text: 'Negligible (<3ms Envoy Proxy overhead)', options: { bold: true, color: C_NAVY, fontSize: 12 } }
      ]
    ];

    s6.addTable([tableHeaders, ...tableRows], {
      x: 0.5,
      y: 1.1,
      w: 9.0,
      h: 2.8,
      border: { pt: 1, color: C_CARD_BORDER },
      fill: { color: C_CARD_BG },
      fontFace: 'Calibri',
      valign: 'middle'
    });

    // Key takeaway card
    s6.addShape(pres.ShapeType.roundRect, {
      x: 0.5,
      y: 4.05,
      w: 9.0,
      h: 0.95,
      rectRadius: 0.08,
      fill: { color: 'EFF6FF' },
      line: { color: 'BFDBFE', width: 1.2 }
    });

    s6.addText([
      { text: '• Trade-off Analysis Rationale: ', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: 'The minimal proxy latency overhead (<3ms) is decisively justified by automated zero-trust security (mTLS), transparent traffic shifting (canary 90/10), and complete telemetry without modifying application code.', options: { color: C_TEXT, fontSize: 22 } }
    ], {
      x: 0.7,
      y: 4.12,
      w: 8.6,
      h: 0.82,
      fontFace: 'Calibri',
      valign: 'middle'
    });
  }

  // ==========================================
  // SLIDE 7: COMPLETE SYSTEM ARCHITECTURE
  // ==========================================
  {
    const s7 = pres.addSlide();
    applySlideTemplate(s7, 'COMPLETE SYSTEM ARCHITECTURE', 7, 'Architecture Diagram, Technology Stack & Design Rationale');

    // If SVG diagram exists, show diagram + tech stack summary
    if (fs.existsSync(path.join(__dirname, 'architecture_diagram.svg'))) {
      s7.addImage({
        path: path.join(__dirname, 'architecture_diagram.svg'),
        x: 0.5,
        y: 1.05,
        w: 5.6,
        h: 3.95
      });
    }

    // Right Column: Technology Stack & Tools Required
    s7.addShape(pres.ShapeType.roundRect, {
      x: 6.3,
      y: 1.05,
      w: 3.2,
      h: 3.95,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s7.addText('CORE TECHNOLOGY STACK', {
      x: 6.45,
      y: 1.15,
      w: 2.9,
      h: 0.25,
      fontFace: 'Calibri',
      fontSize: 15,
      bold: true,
      color: C_KL_RED
    });

    const stackBullets = [
      { text: '• Frontend:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  React 18, Vite, Three.js, Tailwind\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Backend & AI:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Spring Boot 3.1, Java 21, FastAPI\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Gateway & Mesh:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  Istio 1.20, Envoy, Node.js Gateway\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Analytical Tools:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Prometheus, Grafana, Loki, Tempo', options: { color: C_TEXT, fontSize: 22 } }
    ];

    s7.addText(stackBullets, {
      x: 6.45,
      y: 1.45,
      w: 2.9,
      h: 3.45,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 18
    });
  }

  // ==========================================
  // SLIDE 8: DETAILED DESIGN & DATA FLOW
  // ==========================================
  {
    const s8 = pres.addSlide();
    applySlideTemplate(s8, 'DETAILED DESIGN & DATA FLOW', 8, 'End-to-End Traffic Routing & Inter-Service Flow');

    if (fs.existsSync(path.join(__dirname, 'dataflow_diagram.svg'))) {
      s8.addImage({
        path: path.join(__dirname, 'dataflow_diagram.svg'),
        x: 0.5,
        y: 1.05,
        w: 5.6,
        h: 3.95
      });
    }

    // Right Column: Data Flow Sequence Points
    s8.addShape(pres.ShapeType.roundRect, {
      x: 6.3,
      y: 1.05,
      w: 3.2,
      h: 3.95,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s8.addText('DATA FLOW PIPELINE', {
      x: 6.45,
      y: 1.15,
      w: 2.9,
      h: 0.25,
      fontFace: 'Calibri',
      fontSize: 15,
      bold: true,
      color: C_NAVY
    });

    const flowPoints = [
      { text: '1. Ingress Routing:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Istio Gateway routes HTTPS to Node.js API Gateway (Port 4000).\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '2. Strict mTLS Mesh:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  Sidecars encrypt East-West calls with SPIFFE certificate checks.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '3. Canary Release:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  VirtualService splits 90% traffic to v1 and 10% to v2 canary.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '4. Event Streaming:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  Kafka asynchronously notifies passengers on booking events.', options: { color: C_TEXT, fontSize: 22 } }
    ];

    s8.addText(flowPoints, {
      x: 6.45,
      y: 1.45,
      w: 2.9,
      h: 3.45,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 18
    });
  }

  // ==========================================
  // SLIDE 9: IMPLEMENTATION & UNIT-LEVEL PROGRESS
  // ==========================================
  {
    const s9 = pres.addSlide();
    applySlideTemplate(s9, 'IMPLEMENTATION & UNIT-LEVEL PROGRESS', 9, 'Module-wise Deliverables & Completion Status');

    const modules = [
      {
        name: 'API Gateway & Ingress Layer',
        tech: 'Node.js Express / Istio Ingress',
        desc: 'Reverse proxy routing, persona header forwarding, token-bucket rate limiter, and health check endpoints.',
        status: '100% Completed'
      },
      {
        name: 'Core Airlines Microservice',
        tech: 'Java 21 / Spring Boot 3.1.5',
        desc: 'Flight catalog CRUD, dynamic 3D seat capacity engine, and overbooking rebalance resolution.',
        status: '100% Completed'
      },
      {
        name: 'Istio Service Mesh & Security',
        tech: 'Istio 1.20 / Envoy / mTLS',
        desc: 'STRICT mTLS encryption, 90/10 canary traffic routing, and DestinationRule circuit breakers.',
        status: '100% Completed'
      },
      {
        name: 'AI Flight Assistant Service',
        tech: 'Python 3.11 / FastAPI / Uvicorn',
        desc: 'NLP flight discovery query parser, baggage policy assistant, and smart upgrade recommendations.',
        status: '100% Completed'
      },
      {
        name: 'Interactive Frontend & 3D Map',
        tech: 'React 18 / Vite / Three.js',
        desc: 'Multi-persona role switcher, real-time 3D airplane seat selector, and live booking management.',
        status: '100% Completed'
      },
      {
        name: 'Observability & Monitoring',
        tech: 'Prometheus / Grafana / Tempo',
        desc: 'Live telemetry dashboards, P99 latency tracking, distributed tracing, and Docker orchestration.',
        status: '100% Completed'
      }
    ];

    // Render 6 cards in a 2x3 grid
    const cardW = 4.3;
    const cardH = 1.15;
    const startX = 0.5;
    const startY = 1.1;
    const gapX = 0.4;
    const gapY = 0.18;

    modules.forEach((mod, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const posX = startX + col * (cardW + gapX);
      const posY = startY + row * (cardH + gapY);

      s9.addShape(pres.ShapeType.roundRect, {
        x: posX,
        y: posY,
        w: cardW,
        h: cardH,
        rectRadius: 0.08,
        fill: { color: C_CARD_BG },
        line: { color: C_CARD_BORDER, width: 1 }
      });

      // Status Badge
      s9.addShape(pres.ShapeType.roundRect, {
        x: posX + cardW - 1.45,
        y: posY + 0.1,
        w: 1.35,
        h: 0.24,
        rectRadius: 0.04,
        fill: { color: 'DCFCE7' },
        line: { color: '86EFAC', width: 0.8 }
      });

      s9.addText(mod.status, {
        x: posX + cardW - 1.45,
        y: posY + 0.12,
        w: 1.35,
        h: 0.2,
        fontFace: 'Calibri',
        fontSize: 11,
        bold: true,
        color: C_ACCENT_GREEN,
        align: 'center'
      });

      // Module Name
      s9.addText(mod.name, {
        x: posX + 0.15,
        y: posY + 0.1,
        w: cardW - 1.6,
        h: 0.25,
        fontFace: 'Calibri',
        fontSize: 14,
        bold: true,
        color: C_NAVY
      });

      // Tech label
      s9.addText(mod.tech, {
        x: posX + 0.15,
        y: posY + 0.35,
        w: cardW - 0.3,
        h: 0.2,
        fontFace: 'Calibri',
        fontSize: 11,
        bold: true,
        color: C_KL_RED
      });

      // Description
      s9.addText(mod.desc, {
        x: posX + 0.15,
        y: posY + 0.58,
        w: cardW - 0.3,
        h: 0.5,
        fontFace: 'Calibri',
        fontSize: 11,
        color: C_TEXT
      });
    });
  }

  // ==========================================
  // SLIDE 10: TESTING & RESULTS
  // ==========================================
  {
    const s10 = pres.addSlide();
    applySlideTemplate(s10, 'TESTING& RESULTS', 10, 'Validation, Stress Testing & Performance Metrics');

    // 3 Metric Cards across Top
    const metrics = [
      { label: 'AVERAGE LATENCY', val: '42 ms', sub: 'Sub-10ms Redis / 88ms DB', color: C_ACCENT_GREEN },
      { label: 'TEST CODE COVERAGE', val: '92.4%', sub: 'JUnit 5 & Mockito Suites', color: C_NAVY },
      { label: 'LOAD THROUGHPUT', val: '250+ RPS', sub: '0.00% Error Rate (Locust)', color: C_KL_RED }
    ];

    metrics.forEach((m, idx) => {
      const x = 0.5 + idx * 3.1;
      s10.addShape(pres.ShapeType.roundRect, {
        x: x,
        y: 1.1,
        w: 2.8,
        h: 1.1,
        rectRadius: 0.08,
        fill: { color: C_CARD_BG },
        line: { color: C_CARD_BORDER, width: 1.2 }
      });

      s10.addText(m.label, {
        x: x + 0.1,
        y: 1.18,
        w: 2.6,
        h: 0.2,
        fontFace: 'Calibri',
        fontSize: 12,
        bold: true,
        color: C_MUTED,
        align: 'center'
      });

      s10.addText(m.val, {
        x: x + 0.1,
        y: 1.38,
        w: 2.6,
        h: 0.45,
        fontFace: 'Calibri',
        fontSize: 24,
        bold: true,
        color: m.color,
        align: 'center'
      });

      s10.addText(m.sub, {
        x: x + 0.1,
        y: 1.85,
        w: 2.6,
        h: 0.25,
        fontFace: 'Calibri',
        fontSize: 11,
        color: C_TEXT,
        align: 'center'
      });
    });

    // Bottom Detailed Results Box
    s10.addShape(pres.ShapeType.roundRect, {
      x: 0.5,
      y: 2.35,
      w: 9.0,
      h: 2.65,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s10.addText('SERVICE MESH RESILIENCE & VERIFICATION RESULTS', {
      x: 0.7,
      y: 2.45,
      w: 8.6,
      h: 0.25,
      fontFace: 'Calibri',
      fontSize: 15,
      bold: true,
      color: C_NAVY
    });

    const testBullets = [
      { text: '• Canary Traffic Split Verification: ', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: 'Validated exact 90/10 weight routing between v1 and v2 deployments with zero packet drops.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Circuit Breaker Ejection: ', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: 'Envoy automatically ejected pods after 3 consecutive 5xx errors (30s cooldown), stopping cascading failure.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Zero-Trust Strict mTLS Enforcement: ', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '100% of inter-service traffic encrypted; unauthorized non-mesh connections rejected with HTTP 403.', options: { color: C_TEXT, fontSize: 22 } }
    ];

    s10.addText(testBullets, {
      x: 0.7,
      y: 2.75,
      w: 8.6,
      h: 2.1,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 22
    });
  }

  // ==========================================
  // SLIDE 11: CONCLUSION & FUTURE SCOPE
  // ==========================================
  {
    const s11 = pres.addSlide();
    applySlideTemplate(s11, 'CONCLUSION& FUTURE SCOPE', 11);

    // Left Column: Conclusion
    s11.addShape(pres.ShapeType.roundRect, {
      x: 0.5,
      y: 1.05,
      w: 4.4,
      h: 3.95,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s11.addText('CONCLUSION', {
      x: 0.7,
      y: 1.15,
      w: 4.0,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 16,
      bold: true,
      color: C_NAVY
    });

    const conclusionBullets = [
      { text: '• Robust Cloud-Native Core:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Successfully engineered an enterprise API Gateway and Istio Service Mesh platform.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Zero-Trust & High Availability:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  Eliminated single points of failure with automated mTLS and circuit breakers.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Intelligent Integration:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Seamlessly combined 3D cabin graphics, Spring Boot microservices, and FastAPI AI.', options: { color: C_TEXT, fontSize: 22 } }
    ];

    s11.addText(conclusionBullets, {
      x: 0.7,
      y: 1.5,
      w: 4.0,
      h: 3.35,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 22
    });

    // Right Column: Future Scope
    s11.addShape(pres.ShapeType.roundRect, {
      x: 5.1,
      y: 1.05,
      w: 4.4,
      h: 3.95,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    s11.addText('FUTURE SCOPE', {
      x: 5.3,
      y: 1.15,
      w: 4.0,
      h: 0.3,
      fontFace: 'Calibri',
      fontSize: 16,
      bold: true,
      color: C_KL_RED
    });

    const futureBullets = [
      { text: '• Multi-Cluster Mesh Federation:\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  Extending Istio service mesh across hybrid multi-cloud clusters (AWS EKS & GCP GKE).\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• Dynamic Policy Enforcement:\n', options: { bold: true, color: C_KL_RED, fontSize: 22 } },
      { text: '  Integrating Open Policy Agent (OPA) for fine-grained attribute-based access control.\n\n', options: { color: C_TEXT, fontSize: 22 } },

      { text: '• AI-Driven Autoscaling (KEDA):\n', options: { bold: true, color: C_NAVY, fontSize: 22 } },
      { text: '  Predictive workload autoscaling using real-time Prometheus traffic metrics.', options: { color: C_TEXT, fontSize: 22 } }
    ];

    s11.addText(futureBullets, {
      x: 5.3,
      y: 1.5,
      w: 4.0,
      h: 3.35,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 22
    });
  }

  // ==========================================
  // SLIDE 12: THANK YOU
  // ==========================================
  {
    const s12 = pres.addSlide();
    
    // Logo Top Left
    if (fs.existsSync(path.join(__dirname, 'kl_logo.svg'))) {
      s12.addImage({
        path: path.join(__dirname, 'kl_logo.svg'),
        x: 0.4,
        y: 0.25,
        w: 1.5,
        h: 0.45
      });
    }

    // Centered Thank You
    s12.addText('THANK YOU', {
      x: 1.0,
      y: 1.4,
      w: 8.0,
      h: 0.8,
      fontFace: 'Calibri',
      fontSize: 44,
      bold: true,
      color: C_DARK_TITLE,
      align: 'center'
    });

    s12.addText('Cloud-Native API Gateway and Service Mesh Architecture', {
      x: 1.0,
      y: 2.3,
      w: 8.0,
      h: 0.4,
      fontFace: 'Calibri',
      fontSize: 20,
      bold: true,
      color: C_NAVY,
      align: 'center'
    });

    s12.addText('Questions & Answers / Discussion', {
      x: 1.0,
      y: 2.75,
      w: 8.0,
      h: 0.35,
      fontFace: 'Calibri',
      fontSize: 16,
      italic: true,
      color: C_KL_RED,
      align: 'center'
    });

    // Team details pill
    s12.addShape(pres.ShapeType.roundRect, {
      x: 1.5,
      y: 3.3,
      w: 7.0,
      h: 1.2,
      rectRadius: 0.08,
      fill: { color: C_CARD_BG },
      line: { color: C_CARD_BORDER, width: 1 }
    });

    const teamList = [
      { text: 'Bandaru Sai Venkat Ram (2300031764)   |   Davuluri Bala Gopal (2300032878)\n', options: { fontSize: 13, bold: true, color: C_TEXT } },
      { text: 'Akaramsetty Siva Sai (2300033233)   |   Rohid Baig (2300039146)\n\n', options: { fontSize: 13, bold: true, color: C_TEXT } },
      { text: 'Department of Computer Science & Engineering  •  KL University', options: { fontSize: 12, color: C_MUTED } }
    ];

    s12.addText(teamList, {
      x: 1.6,
      y: 3.42,
      w: 6.8,
      h: 0.95,
      fontFace: 'Calibri',
      align: 'center',
      valign: 'middle'
    });

    // Footer line
    s12.addShape(pres.ShapeType.line, {
      x: 0.4,
      y: 5.15,
      w: 9.2,
      h: 0,
      line: { color: C_LINE_GRAY, width: 1.0 }
    });

    s12.addText('21-09-2026', { x: 0.4, y: 5.22, w: 2.0, h: 0.3, fontFace: 'Calibri', fontSize: 12, color: C_FOOTER_GRAY });
    s12.addText('Review-II', { x: 3.5, y: 5.22, w: 3.0, h: 0.3, fontFace: 'Calibri', fontSize: 12, color: C_FOOTER_GRAY, align: 'center' });
    s12.addText('Department of CSE-2', { x: 6.8, y: 5.22, w: 2.2, h: 0.3, fontFace: 'Calibri', fontSize: 12, color: C_FOOTER_GRAY, align: 'right' });
    s12.addText('12', { x: 9.1, y: 5.22, w: 0.5, h: 0.3, fontFace: 'Calibri', fontSize: 12, color: C_FOOTER_GRAY, align: 'right' });
  }

  // Save the PPTX file with the required name format
  const fileName = '2300031764_CSE-2_Review-II.pptx';
  await pres.writeFile({ fileName: fileName });
  console.log(`Successfully generated presentation: ${fileName}`);

  // Also write a copy to Review-II_Presentation.pptx for convenience
  await pres.writeFile({ fileName: 'Review-II_Presentation.pptx' });
  console.log(`Successfully generated copy: Review-II_Presentation.pptx`);
}

createReviewPPT().catch(err => {
  console.error('Error generating PPT:', err);
  process.exit(1);
});
