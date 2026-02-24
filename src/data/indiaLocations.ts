// Minimal India states and example districts list used for dashboard selects
export const indiaStates = [
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Uttar Pradesh',
  'West Bengal',
  'Kerala',
  'Telangana',
  'Andhra Pradesh',
  'Gujarat',
  'Rajasthan',
  'Haryana',
  'Bihar'
];

export const indiaDistricts: Record<string, string[]> = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  'Karnataka': ['Bengaluru', 'Mysore', 'Mangalore'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Delhi': ['New Delhi'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi'],
  'West Bengal': ['Kolkata', 'Howrah'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode'],
  'Telangana': ['Hyderabad', 'Warangal'],
  'Andhra Pradesh': ['Vijayawada', 'Visakhapatnam'],
  'Gujarat': ['Ahmedabad', 'Surat'],
  'Rajasthan': ['Jaipur', 'Udaipur'],
  'Haryana': ['Gurgaon', 'Faridabad'],
  'Bihar': ['Patna', 'Gaya'],
};

export default { indiaStates, indiaDistricts };
