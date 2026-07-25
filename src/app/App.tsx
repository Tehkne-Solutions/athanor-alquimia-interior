import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { AccessibilityPage } from '../pages/AccessibilityPage';
import { BibleSetupPage } from '../pages/BibleSetupPage';
import { ChainPage } from '../pages/ChainPage';
import { CharacterCreatePage } from '../pages/CharacterCreatePage';
import { CharacterPage } from '../pages/CharacterPage';
import { ClassificationPage } from '../pages/ClassificationPage';
import { CodexPage } from '../pages/CodexPage';
import { CraftingPage } from '../pages/CraftingPage';
import { DevPage } from '../pages/DevPage';
import { HomologationPage } from '../pages/HomologationPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ItemPage } from '../pages/ItemPage';
import { LibraryPage } from '../pages/LibraryPage';
import { LimitsPage } from '../pages/LimitsPage';
import { MissionPage } from '../pages/MissionPage';
import { PsalmsChamberPage } from '../pages/PsalmsChamberPage';
import { ReviewPage } from '../pages/ReviewPage';
import { SafetyPage } from '../pages/SafetyPage';
import { TempleFoundationPage } from '../pages/TempleFoundationPage';
import { TemplePage } from '../pages/TemplePage';
import { WaterChalicePage } from '../pages/WaterChalicePage';
import { WaterLamentPage } from '../pages/WaterLamentPage';
import { WaterMemoryPage } from '../pages/WaterMemoryPage';
import { WaterMissionPage } from '../pages/WaterMissionPage';
import { WaterTrustPage } from '../pages/WaterTrustPage';
import { WelcomePage } from '../pages/WelcomePage';
import { useAthanorStore } from '../state/useAthanorStore';

function BootScreen() {
  return <div className="boot-screen"><span className="brand__mark">A</span><p>Preparando o Templo…</p></div>;
}

function RootRedirect() {
  const initialized = useAthanorStore((state) => state.initialized);
  const onboardingCompleted = useAthanorStore((state) => state.onboardingCompleted);
  if (!initialized) return <BootScreen/>;
  return <Navigate to={onboardingCompleted ? '/temple' : '/welcome'} replace/>;
}

function ProtectedShell() {
  const initialized = useAthanorStore((state) => state.initialized);
  const onboardingCompleted = useAthanorStore((state) => state.onboardingCompleted);
  if (!initialized) return <BootScreen/>;
  if (!onboardingCompleted) return <Navigate to="/welcome" replace/>;
  return <AppShell/>;
}

export function App() {
  return <Routes>
    <Route path="/" element={<RootRedirect/>}/>
    <Route path="/welcome" element={<WelcomePage/>}/>
    <Route path="/limits" element={<LimitsPage/>}/>
    <Route path="/character/create" element={<CharacterCreatePage/>}/>
    <Route path="/temple/foundation" element={<TempleFoundationPage/>}/>
    <Route path="/setup/bible" element={<BibleSetupPage/>}/>
    <Route path="/safety" element={<SafetyPage/>}/>
    <Route element={<ProtectedShell/>}>
      <Route path="/temple" element={<TemplePage/>}/>
      <Route path="/temple/map" element={<TemplePage/>}/>
      <Route path="/temple/proverbs-library" element={<LibraryPage/>}/>
      <Route path="/temple/psalms-chamber" element={<PsalmsChamberPage/>}/>
      <Route path="/mission/word-before-response" element={<MissionPage/>}/>
      <Route path="/mission/word-before-response/classification" element={<ClassificationPage/>}/>
      <Route path="/mission/word-before-response/chain" element={<ChainPage/>}/>
      <Route path="/mission/name-the-waters" element={<WaterMissionPage/>}/>
      <Route path="/mission/voice-of-lament" element={<WaterLamentPage/>}/>
      <Route path="/mission/mirror-of-memories" element={<WaterMemoryPage/>}/>
      <Route path="/mission/space-of-trust" element={<WaterTrustPage/>}/>
      <Route path="/crafting/memory-serene-chalice" element={<WaterChalicePage/>}/>
      <Route path="/crafting/clear-word-lamp" element={<CraftingPage/>}/>
      <Route path="/items/clear-word-lamp" element={<ItemPage/>}/>
      <Route path="/review/clear-word-lamp" element={<ReviewPage/>}/>
      <Route path="/inventory" element={<InventoryPage/>}/>
      <Route path="/codex" element={<CodexPage/>}/>
      <Route path="/character" element={<CharacterPage/>}/>
      <Route path="/settings/accessibility" element={<AccessibilityPage/>}/>
      <Route path="/homologation" element={<HomologationPage/>}/>
      {import.meta.env.DEV && <Route path="/dev" element={<DevPage/>}/>} 
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
