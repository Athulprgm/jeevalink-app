import { View } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import DonorDashboard from '../../components/Dashboard/DonorDashboard';
import VolunteerDashboard from '../../components/Dashboard/VolunteerDashboard';

export default function HomeIndexScreen() {
  const { currentUser } = useAppStore();

  return (
    <View className="flex-1 bg-slate-50">
      {currentUser?.role === 'volunteer' ? <VolunteerDashboard /> : <DonorDashboard />}
    </View>
  );
}
