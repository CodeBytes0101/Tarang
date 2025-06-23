import { PeerMessage } from '../types';

class PeerService {
  private peers: RTCPeerConnection[] = [];
  private dataChannels: RTCDataChannel[] = [];
  private messageHandlers: ((message: PeerMessage) => void)[] = [];

  constructor() {
    this.initializePeerConnection();
  }

  private initializePeerConnection() {
    // WebRTC configuration for peer-to-peer communication
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    try {
      const peerConnection = new RTCPeerConnection(configuration);
      
      // Create data channel for messaging
      const dataChannel = peerConnection.createDataChannel('disaster-comm', {
        ordered: true
      });

      dataChannel.onopen = () => {
        console.log('Peer data channel opened');
      };

      dataChannel.onmessage = (event) => {
        try {
          const message: PeerMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing peer message:', error);
        }
      };

      this.peers.push(peerConnection);
      this.dataChannels.push(dataChannel);
    } catch (error) {
      console.error('WebRTC not supported:', error);
    }
  }

  async sendMessage(message: PeerMessage): Promise<boolean> {
    try {
      const messageString = JSON.stringify(message);
      
      for (const channel of this.dataChannels) {
        if (channel.readyState === 'open') {
          channel.send(messageString);
          return true;
        }
      }
      
      // Fallback: Store message locally for later transmission
      this.storeMessageForLater(message);
      return false;
    } catch (error) {
      console.error('Error sending peer message:', error);
      return false;
    }
  }

  private async storeMessageForLater(message: PeerMessage) {
    // Store message in local storage to send when connection is available
    const pendingMessages = JSON.parse(
      localStorage.getItem('pending-peer-messages') || '[]'
    );
    pendingMessages.push(message);
    localStorage.setItem('pending-peer-messages', JSON.stringify(pendingMessages));
  }

  private handleMessage(message: PeerMessage) {
    // Notify all message handlers
    this.messageHandlers.forEach(handler => handler(message));
  }

  onMessage(handler: (message: PeerMessage) => void) {
    this.messageHandlers.push(handler);
  }

  // Broadcast emergency alert to all connected peers
  async broadcastEmergencyAlert(content: string, location: { lat: number; lng: number }) {
    const message: PeerMessage = {
      id: Date.now().toString(),
      from: 'user',
      to: 'broadcast',
      content: JSON.stringify({
        type: 'emergency',
        message: content,
        location,
        timestamp: Date.now()
      }),
      type: 'emergency',
      timestamp: Date.now(),
      delivered: false
    };

    return await this.sendMessage(message);
  }

  // Check for nearby devices using Bluetooth (if available)
  async scanForNearbyDevices(): Promise<string[]> {
    try {
      if ('bluetooth' in navigator) {
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['generic_access']
        });
        return [device.id];
      }
    } catch (error) {
      console.log('Bluetooth not available or not permitted');
    }
    return [];
  }
}

export const peerService = new PeerService();