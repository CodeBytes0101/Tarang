export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'fire' | 'medical' | 'disaster' | 'other';
  area: string;
  language: string[];
}

export interface HelpRequest {
  id: string;
  type: 'need' | 'offer';
  category: 'medical' | 'food' | 'shelter' | 'transport' | 'rescue' | 'other';
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contactInfo: {
    name: string;
    phone?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  status: 'active' | 'fulfilled' | 'expired';
  synced: boolean;
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: 'earthquake' | 'flood' | 'fire' | 'cyclone' | 'general';
  language: string;
}

export interface UserPreferences {
  language: string;
  location: {
    lat: number;
    lng: number;
  };
  emergencyContacts: string[];
  lowPowerMode: boolean;
  notifications: {
    alerts: boolean;
    requests: boolean;
  };
}

export interface PeerMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'text' | 'emergency' | 'help-request';
  timestamp: number;
  delivered: boolean;
}

// New AI Alert Detector Types
export interface EmergencyAlert {
  id: string;
  content: string;
  source: {
    id: string;
    name: string;
    type: 'official' | 'user' | 'media' | 'unknown';
    verified: boolean;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    radius?: number;
  };
  category: 'earthquake' | 'flood' | 'fire' | 'cyclone' | 'medical' | 'security' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  expiresAt?: number;
  media?: {
    images: string[];
    videos: string[];
  };
  tags: string[];
}

export interface AlertVerificationResult {
  id: string;
  alertId: string;
  isVerified: boolean;
  trustScore: TrustScore;
  flags: string[];
  reasoning: string;
  recommendations: string[];
  processingTime: number;
  timestamp: number;
}

export interface TrustScore {
  overall: number; // 0-1 scale
  content: number;
  source: number;
  location: number;
  temporal: number;
  crossReference: number;
  breakdown: any;
}

export interface MisinformationReport {
  id: string;
  alertId: string;
  reportedBy: string;
  reason: 'fake_news' | 'misleading' | 'spam' | 'inappropriate' | 'other';
  description: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'resolved';
}