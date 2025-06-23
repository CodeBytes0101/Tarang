import localforage from 'localforage';
import CryptoJS from 'crypto-js';
import { EmergencyContact, HelpRequest, SafetyTip, UserPreferences, EmergencyAlert, MisinformationReport } from '../types';

class DataService {
  private encryptionKey = 'nirantar-secure-key-2024';

  constructor() {
    localforage.config({
      name: 'NirantarDB',
      storeName: 'disaster_data'
    });
  }

  private encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
  }

  private decrypt(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // Emergency Contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
      const data = await localforage.getItem<string>('emergency-contacts');
      if (data) {
        return this.decrypt(data);
      }
      return this.getDefaultEmergencyContacts();
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      return this.getDefaultEmergencyContacts();
    }
  }

  async saveEmergencyContacts(contacts: EmergencyContact[]): Promise<void> {
    try {
      const encrypted = this.encrypt(contacts);
      await localforage.setItem('emergency-contacts', encrypted);
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
    }
  }

  private getDefaultEmergencyContacts(): EmergencyContact[] {
    return [
      {
        id: '1',
        name: 'Police',
        phone: '100',
        type: 'police',
        area: 'National',
        language: ['en', 'hi']
      },
      {
        id: '2',
        name: 'Fire Department',
        phone: '101',
        type: 'fire',
        area: 'National',
        language: ['en', 'hi']
      },
      {
        id: '3',
        name: 'Medical Emergency',
        phone: '108',
        type: 'medical',
        area: 'National',
        language: ['en', 'hi']
      },
      {
        id: '4',
        name: 'Disaster Management',
        phone: '1070',
        type: 'disaster',
        area: 'National',
        language: ['en', 'hi']
      }
    ];
  }

  // Help Requests
  async getHelpRequests(): Promise<HelpRequest[]> {
    try {
      const data = await localforage.getItem<string>('help-requests');
      if (data) {
        return this.decrypt(data);
      }
      return [];
    } catch (error) {
      console.error('Error getting help requests:', error);
      return [];
    }
  }

  async saveHelpRequest(request: HelpRequest): Promise<void> {
    try {
      const requests = await this.getHelpRequests();
      requests.push(request);
      const encrypted = this.encrypt(requests);
      await localforage.setItem('help-requests', encrypted);
    } catch (error) {
      console.error('Error saving help request:', error);
    }
  }

  async updateHelpRequest(id: string, updates: Partial<HelpRequest>): Promise<void> {
    try {
      const requests = await this.getHelpRequests();
      const index = requests.findIndex(r => r.id === id);
      if (index !== -1) {
        requests[index] = { ...requests[index], ...updates };
        const encrypted = this.encrypt(requests);
        await localforage.setItem('help-requests', encrypted);
      }
    } catch (error) {
      console.error('Error updating help request:', error);
    }
  }

  // Safety Tips
  async getSafetyTips(): Promise<SafetyTip[]> {
    try {
      const data = await localforage.getItem<string>('safety-tips');
      if (data) {
        return this.decrypt(data);
      }
      return this.getDefaultSafetyTips();
    } catch (error) {
      console.error('Error getting safety tips:', error);
      return this.getDefaultSafetyTips();
    }
  }

  private getDefaultSafetyTips(): SafetyTip[] {
    return [
      {
        id: '1',
        title: 'Earthquake Safety',
        content: 'Drop, Cover, and Hold On. Get under a sturdy desk or table and protect your head.',
        category: 'earthquake',
        language: 'en'
      },
      {
        id: '2',
        title: 'Flood Safety',
        content: 'Move to higher ground immediately. Never drive through flooded roads.',
        category: 'flood',
        language: 'en'
      },
      {
        id: '3',
        title: 'Fire Safety',
        content: 'Stay low to avoid smoke. Feel doors before opening. Have an escape plan.',
        category: 'fire',
        language: 'en'
      }
    ];
  }

  // User Preferences
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const data = await localforage.getItem<string>('user-preferences');
      if (data) {
        return this.decrypt(data);
      }
      return this.getDefaultPreferences();
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      const encrypted = this.encrypt(preferences);
      await localforage.setItem('user-preferences', encrypted);
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'en',
      location: { lat: 28.6139, lng: 77.2090 }, // Delhi
      emergencyContacts: [],
      lowPowerMode: false,
      notifications: {
        alerts: true,
        requests: true
      }
    };
  }

  // Emergency Alerts (New)
  async getEmergencyAlerts(): Promise<EmergencyAlert[]> {
    try {
      const data = await localforage.getItem<string>('emergency-alerts');
      if (data) {
        return this.decrypt(data);
      }
      return this.getDefaultEmergencyAlerts();
    } catch (error) {
      console.error('Error getting emergency alerts:', error);
      return this.getDefaultEmergencyAlerts();
    }
  }

  async saveEmergencyAlert(alert: EmergencyAlert): Promise<void> {
    try {
      const alerts = await this.getEmergencyAlerts();
      alerts.unshift(alert); // Add to beginning
      const encrypted = this.encrypt(alerts);
      await localforage.setItem('emergency-alerts', encrypted);
    } catch (error) {
      console.error('Error saving emergency alert:', error);
    }
  }

  private getDefaultEmergencyAlerts(): EmergencyAlert[] {
    return [
      {
        id: 'alert_1',
        content: 'Heavy rainfall warning issued for Delhi NCR region. Waterlogging expected in low-lying areas. Avoid unnecessary travel.',
        source: {
          id: 'imd_official',
          name: 'India Meteorological Department',
          type: 'official',
          verified: true
        },
        location: {
          lat: 28.6139,
          lng: 77.2090,
          address: 'Delhi NCR, India',
          radius: 50000
        },
        category: 'flood',
        severity: 'high',
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        tags: ['weather', 'rainfall', 'flooding']
      },
      {
        id: 'alert_2',
        content: 'BREAKING: Major earthquake of magnitude 6.2 strikes Uttarakhand. Tremors felt across North India. Stay alert for aftershocks.',
        source: {
          id: 'ndma_official',
          name: 'National Disaster Management Authority',
          type: 'official',
          verified: true
        },
        location: {
          lat: 30.0668,
          lng: 79.0193,
          address: 'Uttarakhand, India',
          radius: 200000
        },
        category: 'earthquake',
        severity: 'critical',
        timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
        tags: ['earthquake', 'aftershocks', 'emergency']
      },
      {
        id: 'alert_3',
        content: 'Cyclone Biparjoy approaching Gujarat coast. Evacuation orders issued for coastal areas. Move to safer locations immediately.',
        source: {
          id: 'gujarat_govt',
          name: 'Gujarat State Government',
          type: 'official',
          verified: true
        },
        location: {
          lat: 22.2587,
          lng: 71.1924,
          address: 'Gujarat Coast, India',
          radius: 100000
        },
        category: 'cyclone',
        severity: 'critical',
        timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
        tags: ['cyclone', 'evacuation', 'coastal']
      },
      {
        id: 'alert_4',
        content: 'Fake news alert: Claims about water contamination in Mumbai are FALSE. Official sources confirm water supply is safe.',
        source: {
          id: 'mumbai_municipal',
          name: 'Brihanmumbai Municipal Corporation',
          type: 'official',
          verified: true
        },
        location: {
          lat: 19.0760,
          lng: 72.8777,
          address: 'Mumbai, Maharashtra',
          radius: 25000
        },
        category: 'other',
        severity: 'medium',
        timestamp: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
        tags: ['fake_news', 'water_safety', 'clarification']
      }
    ];
  }

  // Misinformation Reports (New)
  async getMisinformationReports(): Promise<MisinformationReport[]> {
    try {
      const data = await localforage.getItem<string>('misinformation-reports');
      if (data) {
        return this.decrypt(data);
      }
      return [];
    } catch (error) {
      console.error('Error getting misinformation reports:', error);
      return [];
    }
  }

  async saveMisinformationReport(report: MisinformationReport): Promise<void> {
    try {
      const reports = await this.getMisinformationReports();
      reports.push(report);
      const encrypted = this.encrypt(reports);
      await localforage.setItem('misinformation-reports', encrypted);
    } catch (error) {
      console.error('Error saving misinformation report:', error);
    }
  }
}

export const dataService = new DataService();