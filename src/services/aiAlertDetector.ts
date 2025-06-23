import { AlertVerificationResult, EmergencyAlert, TrustScore } from '../types';

class AIAlertDetector {
  private suspiciousPatterns = [
    // Common misinformation patterns
    /urgent.*forward.*everyone/i,
    /breaking.*news.*share/i,
    /government.*hiding.*truth/i,
    /miracle.*cure.*covid/i,
    /fake.*vaccine/i,
    /conspiracy/i,
    /they.*don't.*want.*you.*to.*know/i,
    /share.*before.*deleted/i,
    /doctors.*hate.*this/i,
    /secret.*government/i
  ];

  private reliableSourceKeywords = [
    'ndma', 'disaster management', 'official', 'verified',
    'government', 'police', 'fire department', 'hospital',
    'red cross', 'who', 'health ministry', 'meteorological'
  ];

  private emergencyKeywords = [
    'earthquake', 'flood', 'fire', 'cyclone', 'tsunami',
    'landslide', 'emergency', 'evacuation', 'rescue',
    'medical emergency', 'disaster', 'alert', 'warning'
  ];

  async verifyAlert(alert: EmergencyAlert): Promise<AlertVerificationResult> {
    const startTime = Date.now();
    
    try {
      // Multi-layer verification process
      const contentAnalysis = await this.analyzeContent(alert.content);
      const sourceVerification = await this.verifySource(alert.source);
      const locationVerification = await this.verifyLocation(alert.location);
      const temporalAnalysis = await this.analyzeTemporalPatterns(alert);
      const crossReference = await this.crossReferenceWithOfficialSources(alert);

      // Calculate composite trust score
      const trustScore = this.calculateTrustScore({
        contentAnalysis,
        sourceVerification,
        locationVerification,
        temporalAnalysis,
        crossReference
      });

      const processingTime = Date.now() - startTime;

      return {
        id: `verification_${Date.now()}`,
        alertId: alert.id,
        isVerified: trustScore.overall >= 0.7,
        trustScore,
        flags: this.generateFlags(contentAnalysis, sourceVerification),
        reasoning: this.generateReasoning(trustScore, contentAnalysis),
        recommendations: this.generateRecommendations(trustScore),
        processingTime,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error in alert verification:', error);
      return this.createErrorResult(alert.id);
    }
  }

  private async analyzeContent(content: string): Promise<any> {
    const analysis = {
      suspiciousPatterns: 0,
      emergencyRelevance: 0,
      languageQuality: 0,
      factualConsistency: 0,
      emotionalManipulation: 0
    };

    // Check for suspicious patterns
    this.suspiciousPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        analysis.suspiciousPatterns += 0.2;
      }
    });

    // Check emergency relevance
    this.emergencyKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        analysis.emergencyRelevance += 0.1;
      }
    });

    // Analyze language quality (simple heuristics)
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    
    analysis.languageQuality = Math.min(1, (avgWordLength / 6) * (1 - Math.min(capsRatio * 2, 0.5)));

    // Check for emotional manipulation indicators
    const emotionalWords = ['urgent', 'immediately', 'shocking', 'unbelievable', 'must share'];
    emotionalWords.forEach(word => {
      if (content.toLowerCase().includes(word)) {
        analysis.emotionalManipulation += 0.15;
      }
    });

    return analysis;
  }

  private async verifySource(source: any): Promise<any> {
    const verification = {
      isOfficial: false,
      hasVerificationBadge: false,
      historicalReliability: 0.5,
      domainTrust: 0.5
    };

    if (source.name) {
      // Check if source contains reliable keywords
      const sourceName = source.name.toLowerCase();
      verification.isOfficial = this.reliableSourceKeywords.some(keyword => 
        sourceName.includes(keyword)
      );
    }

    // Simulate historical reliability check
    if (source.id) {
      verification.historicalReliability = Math.random() * 0.4 + 0.3; // 0.3-0.7 range
    }

    return verification;
  }

  private async verifyLocation(location: any): Promise<any> {
    const verification = {
      isValidCoordinates: false,
      isKnownDisasterZone: false,
      populationDensity: 0.5,
      infrastructureRisk: 0.5
    };

    if (location && location.lat && location.lng) {
      // Basic coordinate validation
      verification.isValidCoordinates = 
        location.lat >= -90 && location.lat <= 90 &&
        location.lng >= -180 && location.lng <= 180;

      // Simulate disaster zone check (in real implementation, this would check against disaster databases)
      verification.isKnownDisasterZone = Math.random() > 0.7;
    }

    return verification;
  }

  private async analyzeTemporalPatterns(alert: EmergencyAlert): Promise<any> {
    const analysis = {
      isRecentEvent: true,
      hasTemporalConsistency: true,
      matchesWeatherPatterns: false,
      followsDisasterTimeline: true
    };

    const now = Date.now();
    const alertAge = now - alert.timestamp;
    
    // Check if alert is recent (within 24 hours)
    analysis.isRecentEvent = alertAge < 24 * 60 * 60 * 1000;

    // Simulate weather pattern matching
    analysis.matchesWeatherPatterns = Math.random() > 0.6;

    return analysis;
  }

  private async crossReferenceWithOfficialSources(alert: EmergencyAlert): Promise<any> {
    // Simulate cross-referencing with official sources
    // In real implementation, this would check against NDMA, IMD, etc.
    return {
      foundInOfficialSources: Math.random() > 0.5,
      contradictedByOfficialSources: Math.random() > 0.8,
      similarAlertsCount: Math.floor(Math.random() * 10),
      officialSourcesChecked: ['NDMA', 'IMD', 'Local Authorities']
    };
  }

  private calculateTrustScore(analyses: any): TrustScore {
    const {
      contentAnalysis,
      sourceVerification,
      locationVerification,
      temporalAnalysis,
      crossReference
    } = analyses;

    // Content score (40% weight)
    const contentScore = Math.max(0, Math.min(1, 
      (contentAnalysis.emergencyRelevance * 0.4) +
      (contentAnalysis.languageQuality * 0.3) +
      ((1 - contentAnalysis.suspiciousPatterns) * 0.2) +
      ((1 - contentAnalysis.emotionalManipulation) * 0.1)
    ));

    // Source score (30% weight)
    const sourceScore = Math.max(0, Math.min(1,
      (sourceVerification.isOfficial ? 0.4 : 0) +
      (sourceVerification.hasVerificationBadge ? 0.2 : 0) +
      (sourceVerification.historicalReliability * 0.4)
    ));

    // Location score (15% weight)
    const locationScore = Math.max(0, Math.min(1,
      (locationVerification.isValidCoordinates ? 0.5 : 0) +
      (locationVerification.isKnownDisasterZone ? 0.3 : 0) +
      (locationVerification.populationDensity * 0.2)
    ));

    // Temporal score (10% weight)
    const temporalScore = Math.max(0, Math.min(1,
      (temporalAnalysis.isRecentEvent ? 0.4 : 0) +
      (temporalAnalysis.hasTemporalConsistency ? 0.3 : 0) +
      (temporalAnalysis.matchesWeatherPatterns ? 0.3 : 0)
    ));

    // Cross-reference score (5% weight)
    const crossRefScore = Math.max(0, Math.min(1,
      (crossReference.foundInOfficialSources ? 0.6 : 0) +
      (crossReference.contradictedByOfficialSources ? -0.4 : 0.2) +
      (Math.min(crossReference.similarAlertsCount / 10, 0.2))
    ));

    const overall = 
      (contentScore * 0.4) +
      (sourceScore * 0.3) +
      (locationScore * 0.15) +
      (temporalScore * 0.1) +
      (crossRefScore * 0.05);

    return {
      overall: Math.max(0, Math.min(1, overall)),
      content: contentScore,
      source: sourceScore,
      location: locationScore,
      temporal: temporalScore,
      crossReference: crossRefScore,
      breakdown: {
        contentAnalysis,
        sourceVerification,
        locationVerification,
        temporalAnalysis,
        crossReference
      }
    };
  }

  private generateFlags(contentAnalysis: any, sourceVerification: any): string[] {
    const flags: string[] = [];

    if (contentAnalysis.suspiciousPatterns > 0.3) {
      flags.push('SUSPICIOUS_CONTENT');
    }

    if (contentAnalysis.emotionalManipulation > 0.4) {
      flags.push('EMOTIONAL_MANIPULATION');
    }

    if (!sourceVerification.isOfficial && sourceVerification.historicalReliability < 0.4) {
      flags.push('UNRELIABLE_SOURCE');
    }

    if (contentAnalysis.emergencyRelevance < 0.2) {
      flags.push('LOW_EMERGENCY_RELEVANCE');
    }

    return flags;
  }

  private generateReasoning(trustScore: TrustScore, contentAnalysis: any): string {
    const reasons: string[] = [];

    if (trustScore.overall >= 0.8) {
      reasons.push('High confidence based on reliable source and consistent content');
    } else if (trustScore.overall >= 0.6) {
      reasons.push('Moderate confidence with some verification concerns');
    } else {
      reasons.push('Low confidence due to multiple verification issues');
    }

    if (trustScore.source < 0.4) {
      reasons.push('Source reliability is questionable');
    }

    if (contentAnalysis.suspiciousPatterns > 0.3) {
      reasons.push('Content contains patterns commonly found in misinformation');
    }

    return reasons.join('. ');
  }

  private generateRecommendations(trustScore: TrustScore): string[] {
    const recommendations: string[] = [];

    if (trustScore.overall < 0.5) {
      recommendations.push('Verify with official sources before sharing');
      recommendations.push('Look for corroborating reports from reliable news sources');
    }

    if (trustScore.source < 0.4) {
      recommendations.push('Check the credibility of the information source');
    }

    if (trustScore.overall >= 0.7) {
      recommendations.push('Information appears reliable but always cross-verify emergency alerts');
    }

    recommendations.push('Report suspicious content to help improve community safety');

    return recommendations;
  }

  private createErrorResult(alertId: string): AlertVerificationResult {
    return {
      id: `error_${Date.now()}`,
      alertId,
      isVerified: false,
      trustScore: {
        overall: 0,
        content: 0,
        source: 0,
        location: 0,
        temporal: 0,
        crossReference: 0,
        breakdown: {}
      },
      flags: ['VERIFICATION_ERROR'],
      reasoning: 'Unable to verify alert due to technical issues',
      recommendations: ['Manually verify with official sources'],
      processingTime: 0,
      timestamp: Date.now()
    };
  }

  // Batch verification for multiple alerts
  async verifyMultipleAlerts(alerts: EmergencyAlert[]): Promise<AlertVerificationResult[]> {
    const results = await Promise.all(
      alerts.map(alert => this.verifyAlert(alert))
    );
    return results;
  }

  // Get verification statistics
  getVerificationStats(results: AlertVerificationResult[]) {
    const total = results.length;
    const verified = results.filter(r => r.isVerified).length;
    const flagged = results.filter(r => r.flags.length > 0).length;
    
    const avgTrustScore = results.reduce((sum, r) => sum + r.trustScore.overall, 0) / total;
    const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / total;

    return {
      total,
      verified,
      flagged,
      verificationRate: verified / total,
      avgTrustScore,
      avgProcessingTime,
      commonFlags: this.getCommonFlags(results)
    };
  }

  private getCommonFlags(results: AlertVerificationResult[]): { flag: string; count: number }[] {
    const flagCounts: { [key: string]: number } = {};
    
    results.forEach(result => {
      result.flags.forEach(flag => {
        flagCounts[flag] = (flagCounts[flag] || 0) + 1;
      });
    });

    return Object.entries(flagCounts)
      .map(([flag, count]) => ({ flag, count }))
      .sort((a, b) => b.count - a.count);
  }
}

export const aiAlertDetector = new AIAlertDetector();