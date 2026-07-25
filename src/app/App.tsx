import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { BibleSetupPage } from '../pages/BibleSetupPage';
import { ChainPage } from '../pages/ChainPage';
import { CharacterCreatePage } from '../pages/CharacterCreatePage';
import { CharacterPage } from '../pages/CharacterPage';
import { ClassificationPage } from '../pages/ClassificationPage';
import { CodexPage } from '../pages/CodexPage';
import { CraftingPage } from '../pages/CraftingPage';
import { DevPage } from '../pages/DevPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ItemPage } from '../pages/ItemPage';
import { LibraryPage } from '../pages/LibraryPage';
import { LimitsPage } from '../pages/LimitsPage';
import { MissionPage } from '../pages/MissionPage';
import { SafetyPage } from '../pages/SafetyPage';
import { TempleFoundationPage } from '../pages/TempleFoundationPage';
import { TemplePage } from '../pages/TemplePage';
import { WelcomePage } from '../pages/WelcomePage';
import { useAthanorStore } from '../state/useAthanorStore';

function ProtectedShell() {
  const initialized = useAthanorStore((state) => state.initialized);
  const onboardingCompleted = useAthanorStore((state) => state.onboardingCompleted);
  if (!initialized) return <div className="boot-screen"><span className="brand__mark">A</span><p>Preparando o Templo…</p></div>;
  if (!onboardingCompleted) return <Navigate to="/welcome" replace/>;
  return <AppShell/>;
}

export function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/welcome" replace/>}/>
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
      <Route path="/mission/word-before-response" element={<MissionPage/>}/>
      <Route path="/mission/word-before-response/classification" element={<ClassificationPage/>}/>
      <Route path="/mission/word-before-response/chain" element={<ChainPage/>}/>
      <Route path="/crafting/clear-word-lamp" element={<CraftingPage/>}/>
      <Route path="/items/clear-word-lamp" element={<ItemPage/>}/>
      <Route path="/inventory" element={<InventoryPage/>}/>
      <Route path="/codex" element={<CodexPage/>}/>
      <Route path="/character" element={<CharacterPage/>}/>
      {import.meta.env.DEV && <Route path="/dev" element={<DevPage/>}/>} 
    </Route>
    <Route path="*" element={<Navigate to="/welcome" replace/>}/>
  </Routes>;
}
