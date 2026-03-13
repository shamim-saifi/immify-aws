import express from 'express';
import { AgentBuyLead, AgentDashboardCount, AgentGetCurrentWeekLeadCount, AgentGetLastWeekLeadCount, AgentGetPurchasedLead, AgentLogin, AgentLogout, AgentProfile, AgentSignup, AgentUpdateDocument, AgentUpdateProfile } from '../controllers/agent.controller.js';
import agentAuth from '../middleware/agentAuth.js';

const router = express.Router();

router.route('/signup').post(AgentSignup)
router.route('/login').post(AgentLogin)
router.route('/logout').get(agentAuth, AgentLogout)
router.route('/profile').get(agentAuth, AgentProfile)
router.route('/profile').put(agentAuth, AgentUpdateProfile)
router.route('/document').put(agentAuth, AgentUpdateDocument)

router.route('/dashboard-count').get(agentAuth,AgentDashboardCount)
router.route('/payment-stats/week-days').get(agentAuth, AgentGetLastWeekLeadCount)
router.route('/payment-stats/current-week-days').get(agentAuth, AgentGetCurrentWeekLeadCount)


// --------------------lead api ---------------------
// buy lead || get all leads || get lead by id || get all puchased leads || 
router.route('/buy/:leadId').get(agentAuth, AgentBuyLead)
router.route('/lead').get(agentAuth, AgentGetPurchasedLead)


// we send email to agent when lead is purchased via microservice of email



export default router;