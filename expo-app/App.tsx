import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'activity' | 'wallet' | 'profile'>('home');
  const [selectedVehicle, setSelectedVehicle] = useState('Sedan');
  const [pickup, setPickup] = useState('742 Evergreen Terrace, Beverly Hills');
  const [destination, setDestination] = useState('LAX Airport Terminal 4');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('2:30 PM');
  const [duration, setDuration] = useState('4 Hours');

  const vehicles = [
    { id: 'sedan', name: 'Sedan', tag: 'Comfort', models: 'BMW 3 Series, Camry', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80' },
    { id: 'suv', name: 'SUV', tag: 'High Clearance', models: 'Audi Q7, Fortuner', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80' },
    { id: 'hatchback', name: 'Hatchback', tag: 'Compact', models: 'VW Golf, Mini Cooper', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80' },
    { id: 'luxury', name: 'Luxury Chauffeur', tag: 'Ultra Premium', models: 'Maybach, Panamera', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80' },
    { id: 'ev', name: 'EV Electric', tag: 'Eco Smart', models: 'Tesla Model S, Taycan', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80' },
  ];

  const services = [
    { title: 'Hourly Driver', desc: 'Per-hour chauffeur for errands', price: '$15 / hr', icon: 'time-outline' },
    { title: 'Airport Pickup', desc: 'Punctual terminal transfer', price: '$45 flat', icon: 'airplane-outline' },
    { title: 'Wedding Chauffeur', desc: 'White-glove uniform driver', price: '$120 / day', icon: 'sparkles-outline' },
    { title: 'Night Party Driver', desc: 'Safe designated driver', price: '$35 flat', icon: 'wine-outline' },
    { title: 'Office Drop', desc: 'Work during daily transit', price: '$28 / ride', icon: 'briefcase-outline' },
    { title: 'Outstation Driver', desc: 'Highway certified driver', price: '$80 / day', icon: 'map-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLetter}>R</Text>
          </View>
          <View>
            <View style={styles.subRow}>
              <Text style={styles.brandText}>RIDINGO</Text>
              <View style={styles.dot} />
              <Ionicons name="shield-checkmark" size={12} color="#84CC16" />
              <Text style={styles.verifiedText}>Verified Drivers</Text>
            </View>
            <Text style={styles.locationText}>Beverly Hills, CA</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.avatarButton} onPress={() => setActiveTab('profile')}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Scrollable Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'home' && (
          <>
            {/* Greeting */}
            <View style={styles.greetingRow}>
              <View>
                <Text style={styles.eyebrow}>ON-DEMAND CHAUFFEUR SERVICE</Text>
                <Text style={styles.greetingTitle}>Good Morning, John 👋</Text>
              </View>

              <View style={styles.statusPill}>
                <View style={styles.greenPulse} />
                <Text style={styles.statusText}>Drivers Available</Text>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="#84CC16" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="What service do you need today?"
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
              />
            </View>

            {/* Quick Booking Widget */}
            <View style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.cardTitle}>BOOK DRIVER FOR YOUR VEHICLE</Text>
                </View>
                <TouchableOpacity style={styles.vehiclePill}>
                  <FontAwesome5 name="car" size={11} color="#84CC16" style={{ marginRight: 4 }} />
                  <Text style={styles.vehiclePillText}>{selectedVehicle}</Text>
                </TouchableOpacity>
              </View>

              {/* Pickup & Destination */}
              <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                  <Ionicons name="location-outline" size={16} color="#84CC16" style={styles.iconMargin} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>PICKUP ADDRESS</Text>
                    <TextInput value={pickup} onChangeText={setPickup} style={styles.inputText} />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <Ionicons name="navigate-outline" size={16} color="#121212" style={styles.iconMargin} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>DESTINATION</Text>
                    <TextInput value={destination} onChangeText={setDestination} style={styles.inputText} />
                  </View>
                </View>
              </View>

              {/* Date, Time & Duration row */}
              <View style={styles.tripleRow}>
                <View style={styles.smallBox}>
                  <Text style={styles.boxLabel}>DATE</Text>
                  <Text style={styles.boxValue}>{date}</Text>
                </View>
                <View style={styles.smallBox}>
                  <Text style={styles.boxLabel}>TIME</Text>
                  <Text style={styles.boxValue}>{time}</Text>
                </View>
                <View style={styles.smallBox}>
                  <Text style={styles.boxLabel}>DURATION</Text>
                  <Text style={styles.boxValue}>{duration}</Text>
                </View>
              </View>

              {/* CTA */}
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => Alert.alert('RIDINGO Chauffeur Search', 'Locating available verified driver for your vehicle...')}
              >
                <Text style={styles.ctaText}>Find Available Chauffeur</Text>
                <View style={styles.ctaArrow}>
                  <Feather name="arrow-right" size={14} color="#121212" />
                </View>
              </TouchableOpacity>
            </View>

            {/* My Vehicle Selector */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Select My Vehicle</Text>
              <Text style={styles.sectionSubtitle}>We assign drivers trained for your car model</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {vehicles.map((v) => {
                  const isSelected = selectedVehicle === v.name;
                  return (
                    <TouchableOpacity
                      key={v.id}
                      onPress={() => setSelectedVehicle(v.name)}
                      style={[styles.vehicleCard, isSelected && styles.selectedVehicleCard]}
                    >
                      <Image source={{ uri: v.image }} style={styles.carImage} />
                      <Text style={[styles.carName, isSelected && { color: '#FFF' }]}>{v.name}</Text>
                      <Text style={styles.carModels}>{v.models}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Services Grid */}
            <View style={{ marginTop: 24 }}>
              <Text style={styles.sectionTitle}>Driver Services</Text>
              <View style={styles.servicesGrid}>
                {services.map((s, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.serviceItem}
                    onPress={() => Alert.alert(s.title, `Book ${s.title} for your vehicle`)}
                  >
                    <View style={styles.serviceIconContainer}>
                      <Ionicons name={s.icon as any} size={20} color="#84CC16" />
                    </View>
                    <Text style={styles.serviceTitle}>{s.title}</Text>
                    <Text style={styles.serviceDesc}>{s.desc}</Text>
                    <Text style={styles.servicePrice}>{s.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Spotlight Chauffeur Card */}
            <View style={styles.spotlightCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={styles.spotlightBadge}>
                  <Text style={styles.spotlightBadgeText}>SPOTLIGHT CHAUFFEUR</Text>
                </View>
                <Text style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: 12 }}>★ 4.98 (384)</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80' }}
                  style={styles.spotlightAvatar}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>Marcus Vance</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>9 Yrs Exp • RIDINGO Uniformed</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {activeTab === 'bookings' && (
          <View style={styles.tabCenterView}>
            <Ionicons name="calendar-outline" size={48} color="#84CC16" />
            <Text style={styles.tabCenterTitle}>Booking History</Text>
            <Text style={styles.tabCenterDesc}>RDG-2026-8831 • Hourly Driver (4 Hours)</Text>
          </View>
        )}

        {activeTab === 'activity' && (
          <View style={styles.tabCenterView}>
            <Ionicons name="location-outline" size={48} color="#84CC16" />
            <Text style={styles.tabCenterTitle}>Live GPS Chauffeur Tracking</Text>
            <Text style={styles.tabCenterDesc}>Marcus Vance is 11 mins away in RIDINGO Uniform</Text>
          </View>
        )}

        {activeTab === 'wallet' && (
          <View style={styles.tabCenterView}>
            <Ionicons name="wallet-outline" size={48} color="#84CC16" />
            <Text style={styles.tabCenterTitle}>RIDINGO Wallet Balance</Text>
            <Text style={styles.tabCenterDesc}>$340.50 Available • Instant Apple Pay Top-Up</Text>
          </View>
        )}

        {activeTab === 'profile' && (
          <View style={styles.tabCenterView}>
            <Ionicons name="person-outline" size={48} color="#84CC16" />
            <Text style={styles.tabCenterTitle}>Johnathan Sterling</Text>
            <Text style={styles.tabCenterDesc}>VIP Chauffeur Club Member</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <View style={styles.floatingNavContainer}>
        <View style={styles.floatingNav}>
          {[
            { id: 'home', label: 'Home', icon: 'home-outline' },
            { id: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
            { id: 'activity', label: 'Tracking', icon: 'navigate-outline' },
            { id: 'wallet', label: 'Wallet', icon: 'wallet-outline' },
            { id: 'profile', label: 'Profile', icon: 'person-outline' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                style={[styles.navItem, isActive && styles.activeNavItem]}
              >
                <Ionicons name={tab.icon as any} size={18} color={isActive ? '#84CC16' : '#64748B'} />
                {isActive && <Text style={styles.navText}>{tab.label}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandLetter: { color: '#84CC16', fontWeight: 'bold', fontSize: 18 },
  subRow: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 },
  dot: { width: 3, height: 3, borderRadius: 3, backgroundColor: '#84CC16', marginHorizontal: 4 },
  verifiedText: { fontSize: 10, fontWeight: '800', color: '#4D7C0F', marginLeft: 2 },
  locationText: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', marginTop: 1 },
  avatarButton: { borderRadius: 12, overflow: 'hidden' },
  avatar: { width: 34, height: 34 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 90 },

  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  eyebrow: { fontSize: 9, fontWeight: '800', color: '#4D7C0F', letterSpacing: 0.5 },
  greetingTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  greenPulse: { width: 6, height: 6, borderRadius: 6, backgroundColor: '#84CC16', marginRight: 6 },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '600', color: '#0F172A' },

  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  pulseDot: { width: 7, height: 7, borderRadius: 7, backgroundColor: '#84CC16', marginRight: 6 },
  cardTitle: { fontSize: 10, fontWeight: '900', color: '#0F172A' },
  vehiclePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#121212', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  vehiclePillText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

  inputContainer: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 10, marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  iconMargin: { marginRight: 10 },
  inputLabel: { fontSize: 8, fontWeight: '800', color: '#94A3B8' },
  inputText: { fontSize: 12, fontWeight: 'bold', color: '#0F172A', paddingVertical: 2 },

  tripleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  smallBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 8, borderRadius: 12, marginHorizontal: 2 },
  boxLabel: { fontSize: 8, fontWeight: '800', color: '#94A3B8' },
  boxValue: { fontSize: 11, fontWeight: 'bold', color: '#0F172A', marginTop: 2 },

  ctaButton: {
    backgroundColor: '#121212',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
  },
  ctaText: { color: '#FFF', fontWeight: '900', fontSize: 13, marginRight: 8 },
  ctaArrow: { width: 22, height: 22, borderRadius: 22, backgroundColor: '#84CC16', justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  sectionSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2 },

  vehicleCard: {
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedVehicleCard: { backgroundColor: '#121212', borderColor: '#84CC16' },
  carImage: { width: '100%', height: 80, borderRadius: 12, marginBottom: 8 },
  carName: { fontWeight: 'bold', fontSize: 13, color: '#0F172A' },
  carModels: { fontSize: 10, color: '#64748B', marginTop: 2 },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  serviceItem: {
    width: (width - 44) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceIconContainer: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  serviceTitle: { fontSize: 13, fontWeight: 'bold', color: '#0F172A' },
  serviceDesc: { fontSize: 10, color: '#64748B', marginTop: 2 },
  servicePrice: { fontSize: 11, fontWeight: '900', color: '#84CC16', marginTop: 6 },

  spotlightCard: { backgroundColor: '#121212', borderRadius: 24, padding: 14, marginTop: 10 },
  spotlightBadge: { backgroundColor: '#84CC16', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  spotlightBadgeText: { color: '#121212', fontWeight: '900', fontSize: 9 },
  spotlightAvatar: { width: 44, height: 44, borderRadius: 14 },

  floatingNavContainer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  floatingNav: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  activeNavItem: { backgroundColor: '#262626' },
  navText: { color: '#FFF', fontSize: 11, fontWeight: 'bold', marginLeft: 6 },

  tabCenterView: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 20 },
  tabCenterTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginTop: 12 },
  tabCenterDesc: { fontSize: 12, color: '#64748B', marginTop: 4, textAlign: 'center' },
});
