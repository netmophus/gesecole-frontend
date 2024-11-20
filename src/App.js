
// src/App.js
//import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; // Importez le composant Footer
import RegisterPage from './pages/common/RegisterPage';
import LoginPage from './pages/common/LoginPage';
import MinistereDashboardPage from './pages/ministere/DashboardPage';
import EstablishmentConfigPage from './pages/etablissement/EstablishmentConfigPage'; 
import EstablishmentDashboardPage from './pages/etablissement/DashboardPage'; 


import { AuthProvider } from './context/AuthContext';
//import { AuthProviderBEPC } from './context/AuthContextBEPC'; 

import SubjectPage from './pages/etablissement/SubjectPage';
import ClassPage from './pages/etablissement/ClassPage';
import TeacherPage from './pages/etablissement/TeacherPage';
import StudentPage from './pages/etablissement/StudentPage';
import BulletinPage from './pages/Bulletins/BulletinPage';
import CreateBulletinPage from './pages/Bulletins/CreateBulletinPage';
import BulletinEditPage from './pages/Bulletins/BulletinEditPage';
import GenerateBulletinForm from './components/Bulletins/GenerateBulletinForm';
import BulletinViewPage from './pages/Bulletins/BulletinViewPage';
import HomePage from './pages/HomePage'; // Importez votre nouvelle page d'accueil
import SchoolCardsPage from './pages/eleve/SchoolCardsPage'; // Importation de la nouvelle page des cartes scolaires
import NewsPage from './pages/NewsPage';
// import ResourcesPage from './pages/ResourcesPage';
// import AdminToolsPage from './pages/AdminToolsPage';
import ManageContentPage from './pages/pageAdmin/ManageContentPage'; // Importez la nouvelle page
//import ManageUsersPage from './pages/pageAdmin/ManageUsersPage';
import AdminHomePage from './pages/pageAdmin/AdminHomePage';  // Mettre à jour le chemin d'importation
import EditUserPage from './pages/Administrator/EditUserPage';
import CreateDernierActuArticlePage from './pages/pageAdmin/CreateDernierActuArticlePage'; // La page pour créer un nouvel article
import OngletArticleManagementPage from './pages/Administrator/OngletArticleManagementPage';
import CreateDevoirCompoPage from './pages/etablissement/DevoirCompoPage'; // Importer votre composant
import ViewDevoirComposPage from './pages/etablissement/ViewDevoirComposPage'
import EditDernierActuArticlePage from './pages/pageAdmin/EditDernierActuArticlePage'; // Page pour éditer un article spécifique



import AdminDashboard from './pages/Administrator/AdminDashboard';
import NewsManagement from './pages/Administrator/NewsManagement';
import AdminSectionCardsPage from './pages/Administrator/AdminSectionCardsPage';
import EditSectionCardForm from './pages/Administrator/EditSectionCardForm';
import NewsForm from './components/Administrator/NewsForm';
import ArticlesNewsManagement from './pages/Administrator/ArticlesNewsManagement';  // Assurez-vous du bon chemin d'importation
import ManageUsersPage from './pages/Administrator/ManageUsersPage'; // Importer le composant
import ActivityManagement from './pages/Administrator/ActivityManagement'; // Assurez-vous que le chemin est correct
import EditOngletPage from './pages/Administrator/EditOngletPage'; // Assurez-vous que le chemin est correct
import AcademicYearPage from './pages/etablissement/AcademicYearPage'; // Assurez-vous que le chemin est correct

import PedagogicalResourcePage from './pages/ministere/PedagogicalResourcePage';  // Page de gestion des ressources
import ChapterPage from './pages/ministere/ChapterPage';
//import { Box, CircularProgress } from '@mui/material';

//import { AuthContext } from './context/AuthContext'; 
import StudentDashboard from './pages/eleve/StudentDashboard';  // Importation du dashboard de l'élève
import PedagogicalSubjectPage from './pages/ministere/PedagogicalSubjectPage'; // Import de la page
import ParentDashboard from './pages/parent/DashboardPage'; // Assurez-vous que le chemin est correct








//import NavbarBEPC from './components/BEPC/NavbarBEPC';
import RegisterPageBEPC from './components/BEPC/RegisterPageBEPC';
import LoginPageBEPC from './components/BEPC/LoginPageBEPC';
import DashboardPageBEPC from './components/BEPC/DashboardPageBEPC';
import PaymentPageBEPC from './components/BEPC/PaymentPageBEPC';
import ResultsPageBEPC from './components/BEPC/ResultsPageBEPC';
import BepcAccessPage from './components/BEPC/BepcAccessPage'
import InscriptionPage from './components/BEPC/InscriptionPageBEPC'; // Assuming you have an InscriptionPage component
import AdminDashboardPageBEPC from './components/BEPC/AdminDashboardBEPC';
import AdminCentralDashboardBEPC from './components/BEPC/AdminCentralDashboardBEPC';
import ReportAnalysisPage from './pages/etablissement/ReportAnalysisPage';

import AverageReportPage from './pages/etablissement/AverageReportPage';

import CfepdAccessPage from './components/CFEPD/CfepdAccessPage'
import RegisterPageCFEPD from './components/CFEPD/RegisterPageCFEPD'; // Importez le composant d'inscription CFEPD
import LoginPageCFEPD from './components/CFEPD/LoginPageCFEPD'; // Importez le composant de connexion CFEPD
import DashboardPageCFEPD from './components/CFEPD/DashboardPageCFEPD';
import InscriptionPageCFEPD from './components/CFEPD/InscriptionPageCFEPD'; // Assuming you have an InscriptionPage component
import AdminDashboardCFEPD from './components/CFEPD/AdminDashboardCFEPD';
import AdminDashboardBEPC from './components/BEPC/AdminDashboardBEPC';
const App = () => {

 


  return (
    <Router>
      <AuthProvider>
        <Navbar />        
        <Routes>





        



          <Route path="/" element={<HomePage />} /> {/* Nouvelle page d'accueil */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ministere/dashboard" element={<MinistereDashboardPage />} />
          <Route path="/etablissement/configuration" element={<EstablishmentConfigPage />} />
          <Route path="/etablissement/dashboardPage" element={<EstablishmentDashboardPage />} />
          <Route path="/etablissement/subjects" element={<SubjectPage />} />
          <Route path="/etablissement/teachers" element={<TeacherPage />} />
          <Route path="/classes" element={<ClassPage />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/school-cards" element={<SchoolCardsPage />} />
          <Route path="/bulletins" element={<BulletinPage />} /> 
          <Route path="/bulletins/create" element={<CreateBulletinPage />} />
          <Route path="/bulletins/edit/:id" element={<BulletinEditPage />} />
          <Route path="/generate-bulletin" element={<GenerateBulletinForm />} />
          <Route path="/bulletin/:id" element={<BulletinViewPage />} />
          <Route path="/devoircompos/create" element={<CreateDevoirCompoPage />} /> {/* Ajout de la route pour Devoir/Composition */}
          <Route path="/view-devoircompos" element={<ViewDevoirComposPage />} />
{/* Route pour la page d'analyse des rapports */}
<Route path="/report-analysis" element={<ReportAnalysisPage />} />


<Route path="/average-report" element={<AverageReportPage />} />





          <Route path="/news" element={<NewsPage />} />
        {/* <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/admin-tools" element={<AdminToolsPage />} /> */}
        <Route path="/admin/edit-user/:id" element={<EditUserPage />} />

        <Route path="/ministere/manage-users" element={<ManageUsersPage />} />
        <Route path="/ministere/manage-content" element={<ManageContentPage />} /> {/* Nouvelle route pour gérer le contenu */}
        
        
        <Route path="/admin/create-dernier-actu" element={<CreateDernierActuArticlePage />} /> {/* Route pour créer un nouvel article */}
        <Route path="/admin/homepage" element={<AdminHomePage />} /> {/* Mise à jour de la route */}
        
       
        <Route path="/admin/update-dernier-actu/:id" element={<EditDernierActuArticlePage />} /> {/* Route pour modifier l'article */}
        


        {/*  Encapsuler les routes BEPC avec AuthProviderBEPC */}

        <Route path="/register-bepc" element={<RegisterPageBEPC />} />
        <Route path="/login-bepc" element={<LoginPageBEPC />} />


        {/*Encapsuler les routes CFEPD avec AuthProviderCFEPD*/}

  <Route path="/register-cfepd" element={<RegisterPageCFEPD />} />
  <Route path="/login-cfepd" element={<LoginPageCFEPD />} />

  <Route path="dashboard-cfepd" element={<DashboardPageCFEPD />} />
  <Route path="/cfepdadmin-dashboard" element={<AdminDashboardCFEPD />} />
  <Route path="/inscription-cfepd" element={<InscriptionPageCFEPD />} /> {/* This route points to the inscription page */}



        {/* <Route path="register" element={<RegisterPageBEPC />} />
        <Route path="login" element={<LoginPageBEPC />} /> */}
        <Route path="dashboard-bepc" element={<DashboardPageBEPC />} />
        <Route path="payment" element={<PaymentPageBEPC />} />
        <Route path="results" element={<ResultsPageBEPC />} />
        <Route path="/bepc-access" element={<BepcAccessPage />} />
        <Route path="/bepcadmin-dashboard" element={<AdminDashboardBEPC />} />
        <Route path="/inscription" element={<InscriptionPage />} /> {/* This route points to the inscription page */}


        <Route
          path="/bepcadmin-dashboard" element={<AdminDashboardPageBEPC />} />
        
        <Route
          path="/admincentralbepc-dashboard" element={<AdminCentralDashboardBEPC />} />



       <Route path="/cfepd-access" element={<CfepdAccessPage />} /> 

 {/* Autres routes SUITE */}


        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        <Route path="/admin/news-management" element={<NewsManagement />} />
        <Route path="/admin/section-cards" element={<AdminSectionCardsPage />} />
        <Route path="/admin/edit-section-card/:id" element={<EditSectionCardForm />} />
        <Route path="/admin/create-section-card" element={<NewsForm />} /> {/* Utilisez le formulaire existant */}
        <Route path="/admin/articles/:id" element={<ArticlesNewsManagement />} />
        {/* Route pour gérer les utilisateurs */}
        <Route path="/admin/manage-users" element={<ManageUsersPage />} />

        <Route path="/admin/activity-management" element={<ActivityManagement />} />
        <Route path="/edit-onglet/:id" element={<EditOngletPage />} />
        <Route path="/onglet-articles/:ongletId" element={<OngletArticleManagementPage />} />


{/* Route pour la gestion des ressources pédagogiques par l'Admin */}
<Route path="/admin/pedagogical-subjects" element={<PedagogicalSubjectPage />} /> {/* Page des matières */}
<Route path="/admin/pedagogical-resources" element={<PedagogicalResourcePage />} />
<Route path="/admin/chapters" element={<ChapterPage />} />

 {/* Route pour la gestion des années académiques */}
 <Route path="/academic-years" element={<AcademicYearPage />} />

 <Route path="/eleve/DashboardPage" element={<StudentDashboard />} />  {/* Route for student dashboard */}
 <Route path="/parent/DashboardPage" element={<ParentDashboard />} />


        <Route path="*" element={<Navigate to="/" />} /> {/* Redirection vers la page d'accueil */}
        </Routes>
        <Footer /> {/* Ajoutez le footer ici */}
      </AuthProvider>
    </Router>
  );
};

export default App;
