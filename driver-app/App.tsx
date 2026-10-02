import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import DriverMap from './src/DriverMap';
import { samples, transition, type Ride, type Status } from './src/rides';

type Tab = 'Drive' | 'Rides' | 'Shift' | 'Account';
type Icon = React.ComponentProps<typeof Ionicons>['name'];
const labels: Record<Status,string> = {offered:'New request',accepted:'Head to pickup',arrived:'Waiting for passenger',driving:'Trip in progress',completed:'Completed',declined:'Declined'};
export default function App() {
  const [tab,setTab] = useState<Tab>('Drive');
  const [online,setOnline] = useState(false);
  const [rides,setRides] = useState(samples);
  const [selected,setSelected] = useState<string|null>(null);
  const [pin,setPin] = useState('');
  const [message,setMessage] = useState('');
  const active = rides.find(r => ['accepted','arrived','driving'].includes(r.status));
  const ride = rides.find(r => r.id === selected) || active;
  const offers = rides.filter(r => r.status === 'offered');
  const done = rides.filter(r => r.status === 'completed');
  const update = (r:Ride,status:Status) => {
    try {
      if(status === 'accepted' && (!online || (active && active.id !== r.id))) throw new Error('Go online and finish your current ride before accepting another.');
      const changed = transition(r,status,pin);
      setRides(previous => previous.map(item => item.id === r.id ? changed : item));
      setPin('');setMessage(labels[status]);
      if(status === 'completed' || status === 'declined') setSelected(null);
    } catch(error) {setMessage(error instanceof Error ? error.message : 'Could not update ride.');}
  };
  const card = (r:Ride) => <Pressable key={r.id} accessibilityRole="button" onPress={() => {setSelected(r.id);setTab('Drive');}} style={s.card}>
    <View style={s.row}><Text style={s.service}>Airport transfer</Text><Text style={s.caption}>Company booking</Text></View>
    <View style={s.row}><Ionicons name="ellipse-outline" size={16}/><Text style={s.route}>{r.pickup}</Text></View>
    <View style={s.row}><Ionicons name="location-outline" size={16}/><Text style={s.route}>{r.destination}</Text></View>
    <View style={s.footer}><Text style={s.caption}>{r.passengers} passengers · {r.bags} bags</Text><Text style={s.caption}>{labels[r.status]}</Text></View>
  </Pressable>;
  return <View style={s.screen}><StatusBar style="dark"/><View style={s.shell}>
    {tab === 'Drive' && <DriverMap />}
    <View style={[s.header,tab === 'Drive' && s.floatingHeader]}><View style={s.logo}><Ionicons name="car-sport" size={24}/></View><View style={{flex:1}}><Text style={s.brand}>City Cab</Text><Text style={s.caption}>DRIVER</Text></View><Text style={s.badge}>Preview</Text></View>
    {tab === 'Drive' && <View style={s.availabilityOverlay}><View style={s.availability}><View style={[s.dot,{backgroundColor:online?'#248b62':'#90989d'}]}/><View style={{flex:1}}><Text style={s.heading}>{online?'You are online':'You are offline'}</Text><Text style={s.caption}>{online?'Available for company assignments':'Ready when dispatch assigns your next ride'}</Text></View><Switch accessibilityLabel="Driver availability" value={online} onValueChange={value => {if(!value && active){setMessage('Finish your ride before going offline.');return;}setOnline(value);}} trackColor={{false:'#d7dde0',true:'#91d6f4'}} thumbColor="#fff"/></View></View>}
    <ScrollView style={tab === 'Drive' ? s.rideSheet : {flex:1}} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {!!message && <Pressable accessibilityLabel="Dismiss message" onPress={() => setMessage('')} style={s.notice}><Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text></Pressable>}
      {tab === 'Drive' && <>
        {ride ? <View style={s.detail}><View style={s.row}><Text style={[s.heading,{flex:1}]}>{labels[ride.status]}</Text><Pressable accessibilityLabel="Close ride details" onPress={() => setSelected(null)} style={s.iconButton}><Ionicons name="close" size={24}/></Pressable></View><Text style={s.title}>{ride.passenger}</Text>{card(ride)}<Text style={s.body}>Toyota Corolla Cross · {ride.id}</Text><Text style={s.caption}>Confirm pickup instructions, passenger count and luggage before departure. Customer payments are handled by City Cab.</Text>
          {ride.status === 'offered' && <View style={s.row}><Button label="Decline" secondary onPress={() => update(ride,'declined')}/><Button label="Accept ride" onPress={() => update(ride,'accepted')}/></View>}
          {['accepted','arrived','driving'].includes(ride.status) && <Button label="Open navigation" secondary icon="navigate-outline" onPress={async () => {try{await Linking.openURL('https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent((ride.status==='driving'?ride.destination:ride.pickup)+', Namibia'));}catch{setMessage('Navigation unavailable. Use the address shown.');}}}/>}
          {ride.status === 'accepted' && <Button label="I've arrived" onPress={() => update(ride,'arrived')}/>}
          {ride.status === 'arrived' && <><Text style={s.heading}>Passenger verification</Text><Text style={s.caption}>Ask for the passenger PIN. Sample PIN: {ride.pin}</Text><TextInput accessibilityLabel="Passenger PIN" maxLength={4} keyboardType="number-pad" value={pin} onChangeText={value => setPin(value.replace(/[^0-9]/g,''))} placeholder="4-digit PIN" style={s.input}/><Button label="Verify & start trip" disabled={pin.length!==4} onPress={() => update(ride,'driving')}/></>}
          {ride.status === 'driving' && <Button label="Complete trip" onPress={() => update(ride,'completed')}/>}
        </View> : <><Text style={s.heading}>{online?'Ride requests':'Your next ride starts here'}</Text>{online?offers.map(card):<Text style={s.body}>You are not receiving requests while offline.</Text>}{online && !offers.length && <Text style={s.body}>No pending requests.</Text>}</>}
      </>}
      {tab === 'Rides' && <><Text style={s.title}>Your rides</Text><Text style={s.subtitle}>Requests, active journeys and history</Text>{rides.map(card)}</>}
      {tab === 'Shift' && <><Text style={s.title}>Your shift</Text><Text style={s.subtitle}>Company transport · no personal earnings</Text><View style={s.card}><Text style={s.heading}>{online?'On duty':'Off duty'}</Text><Text style={s.body}>{done.length} completed · {active?1:0} active · {offers.length} pending sample assignments</Text></View>{done.map(card)}{!done.length && <Text style={s.body}>Completed rides will appear in your shift record.</Text>}</>}
      {tab === 'Account' && <><Text style={s.title}>Driver account</Text><Text style={s.subtitle}>Preview driver · not signed in</Text><View style={s.card}><Image source={{uri:'https://assets.cdntoyota.co.za/toyotacms23/attachments/cm5nv0u1xqfyracakek8qpa66-cross-gr-s-side-ret.desktop.png'}} resizeMode="contain" style={{height:150,width:'100%'}}/><Text style={s.heading}>Toyota Corolla Cross</Text><Text style={s.caption}>Compact SUV · preview vehicle</Text></View><Text style={s.heading}>Driver verification</Text><Text style={s.body}>Account and vehicle approval are not connected.</Text><Text style={s.heading}>Location sharing</Text><Text style={s.body}>Live and background tracking are not enabled.</Text><Button label="Reset sample rides" secondary icon="refresh-outline" onPress={() => {setRides(samples);setSelected(null);setOnline(false);setPin('');setMessage('Preview reset.');}}/></>}
      <Text style={s.disclaimer}>Interactive preview. Sample passengers only. Dispatch, payments and live GPS are not connected. Changes reset on reload.</Text>
    </ScrollView>
    <View style={[s.nav,tab === 'Drive' && s.floatingNav]}>{(['Drive','Rides','Shift','Account'] as Tab[]).map((name,index) => <Pressable key={name} accessibilityRole="tab" accessibilityState={{selected:tab===name}} onPress={() => setTab(name)} style={s.navItem}><View style={[s.navIcon,tab===name && {backgroundColor:'#91d6f4'}]}><Ionicons name={(['navigate-outline','car-outline','clipboard-outline','person-outline'] as Icon[])[index]} size={22}/></View><Text style={s.caption}>{name}</Text></Pressable>)}</View>
  </View></View>;
}
function Button({label,onPress,secondary=false,disabled=false,icon}:{label:string;onPress:()=>void;secondary?:boolean;disabled?:boolean;icon?:Icon}){return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[s.button,secondary && {backgroundColor:'#e6edf0'},disabled && {opacity:0.4}]}>{icon && <Ionicons name={icon} size={18}/>}<Text style={s.buttonText}>{label}</Text></Pressable>;}
const s = StyleSheet.create({
  floatingHeader:{backgroundColor:'#ffffffeb',zIndex:10},availabilityOverlay:{position:'absolute',top:120,left:20,right:20,zIndex:10},rideSheet:{position:'absolute',bottom:82,left:12,right:12,maxHeight:'60%',backgroundColor:'#fffffff2',borderRadius:8,zIndex:10},floatingNav:{position:'absolute',bottom:0,left:0,right:0,zIndex:20},
  screen:{flex:1,backgroundColor:'#dfe7eb'},shell:{flex:1,width:'100%',maxWidth:480,alignSelf:'center',backgroundColor:'#f5f7f8'},header:{flexDirection:'row',gap:12,alignItems:'center',padding:20,paddingTop:48,backgroundColor:'#fff'},logo:{width:44,height:44,borderRadius:8,backgroundColor:'#91d6f4',alignItems:'center',justifyContent:'center'},brand:{fontSize:22,fontWeight:'800',color:'#15191c'},badge:{fontSize:11,color:'#6b7379',backgroundColor:'#edf2f4',padding:8,borderRadius:6},content:{padding:20,gap:16,paddingBottom:30},title:{fontSize:26,fontWeight:'800',color:'#15191c'},subtitle:{fontSize:13,color:'#6b7379',marginTop:6},heading:{fontSize:15,fontWeight:'700',color:'#15191c'},caption:{fontSize:12,lineHeight:18,color:'#626d74'},body:{fontSize:14,lineHeight:21,color:'#626d74'},row:{flexDirection:'row',alignItems:'center',gap:10},availability:{flexDirection:'row',gap:12,alignItems:'center',backgroundColor:'#fff',borderRadius:8,padding:16},dot:{width:9,height:9,borderRadius:5},map:{height:270,marginHorizontal:-20,backgroundColor:'#e3edf2',alignItems:'center',justifyContent:'center',overflow:'hidden'},mapLabel:{position:'absolute',left:20,bottom:14,backgroundColor:'#fffffff0',padding:8,fontSize:11,borderRadius:6,color:'#333'},card:{backgroundColor:'#fff',borderWidth:1,borderColor:'#e0e7eb',borderRadius:8,padding:16,gap:14},service:{flex:1,fontSize:12,fontWeight:'700',color:'#3b6d84'},price:{fontSize:20,fontWeight:'800'},route:{flex:1,fontSize:14,fontWeight:'600',lineHeight:20,color:'#15191c'},footer:{flexDirection:'row',justifyContent:'space-between',gap:6,borderTopWidth:1,borderTopColor:'#edf1f3',paddingTop:12},detail:{gap:16},iconButton:{width:44,height:44,alignItems:'center',justifyContent:'center'},button:{minHeight:50,flexDirection:'row',gap:8,alignItems:'center',justifyContent:'center',backgroundColor:'#91d6f4',padding:14,borderRadius:8,flexGrow:1},buttonText:{fontSize:14,fontWeight:'700',color:'#15191c'},input:{height:52,borderWidth:1,borderColor:'#bccbd3',backgroundColor:'#fff',borderRadius:8,paddingHorizontal:16,fontSize:20},nav:{flexDirection:'row',borderTopWidth:1,borderTopColor:'#e3e9ed',backgroundColor:'#fff',paddingTop:10,paddingBottom:22},navItem:{flex:1,alignItems:'center',gap:4},navIcon:{width:54,height:34,alignItems:'center',justifyContent:'center',borderRadius:8},notice:{padding:12,borderRadius:8,backgroundColor:'#e0f1f8'},disclaimer:{fontSize:11,lineHeight:17,color:'#6b7379',marginTop:12},total:{fontSize:42,fontWeight:'800',paddingVertical:24,color:'#15191c'},
});
