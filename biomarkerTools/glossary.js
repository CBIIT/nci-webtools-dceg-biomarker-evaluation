$.extend($_Glossary,{
	AUC : {
		fullName : "Area under the receiver operator characteristic curve",
		definition : " for a biomarker is the average sensitivity (or, equivalently, the integral of the sensitivity) in the interval of cSpecificity from 0 to 1 (specificity from 1 to 0), itself equal to the area between the ROC curve and the x-axis."
	},
	cNPV : {
		fullName : "Complement of Negative Predictive Value (cNPV)",
		definition : "Probability of disease, given a negative test result from biomarker. Unlike sensitivity and specificity, cNPV's reflect disease prevalence and is useful for risk stratification."
	},
  concern: {
    fullName: "Concern",
    definition: "Increase in disease risk from testing positive. Formula: Concern = PPV-P(D+)."
  },
	CV : {
		fullName : "Coefficient of Variation",
		definition : "The coefficient of variation is defined as the ratio of the standard deviation to the mean. It shows the extent of variability in relation to mean of the population."
	},
  d_neg: {
    fullName: "Disease Negative (D-)",
    definition: "Does not have disease."
  },
	Delta : {
		fullName : "Delta",
		definition : "The statistic delta is the ratio of the absolute difference in average level of the biomarker between cases and controls in units of standard deviation."
	},
	DP : {
		fullName : "Disease Prevalence",
		definition : "Proportion of the population with disease, or previously diagnosed with disease, at a given time."
	},
	LR : {
		fullName : "Likelihood Ratios (LR)",
		definition : " The likelihood ratios are factors that update the prior odds to obtain conditional odds of disease after a positive and negative disease."
	},
	LRP : {
		fullName : "Likelihood Ratio Positive (LR+)",
		definition : "The LR+ is the ratio of the probabilities of a case having a positive test (Sensitivity) and of a control having a positive test (cSpecificity)."
	},
	LRN : {
		fullName : "Likelihood Ratio Negative (LR-)",
		definition : "The LR- is the ratio of the probabilities of the control having a negative test (Specificity) and the case having a negative test (cSensitivity)."
	},
  max_mrs: {
    fullName: "Maximum possible MRS for a disease with this prevalence",
    definition: "Maximum possible MRS for a disease with this prevalence. Formula: max risk strat=2q(1-q)."
  },
  m_neg: {
    fullName: "Marker Negativity (M-)",
    definition: "Negative test result for biomarker test."
  },
  mrs: {
    fullName: "Mean Risk Stratification (MRS)",
    definition: "Average change in pretest-posttest disease risk. Formula: MRS=2tp(1-p)."
  },
  nnr: {
    fullName: "Number Needed to Recruit",
    definition: "To detect 1 more disease case in positive group than negative group. Formula: NNR = 1/PBS."
  },
  nns: {
    fullName: "Number Needed to Screen",
    definition: "screenThe reciprocal of the risk difference PPV-cNPV. Formula: Usual NNS = 1/RD"
  },
  npv: {
    fullName: "Negative Predictive Value (NPV)",
    definition: "Probability of not having disease, given a negative test result from biomarker. Unlike sensitivity and specificity, NPV reflects disease prevalence and is useful for risk stratification."
  },
  pbs: {
    fullName: "Population Burden Stratification (PBS)",
    definition: "Extra disease detection in positive group than negative group. " +
    "Formula: PBS = a-b."
  },
	PPV : {
		fullName : "Positive Predictive Value (PPV)",
		definition : "Probability of disease, given a positive test result from biomarker.  Unlike sensitivity and specificity, PPV's reflect disease prevalence and is useful for risk stratification."
	},
	PPVmcNPV : {
		fullName : "PPV-cNPV",
		definition : "The difference PPV-cNPV is a simple measure of the clinical value of the test, or the difference between risks; if PPV is close to cNPV, the screening test will not be very helpful, even if the sensitivity and specificity are high."
	},
  prob_d: {
    fullName: "Disease Positive (D+)",
    definition: "Disease prevalence, or probability of disease."
  },
  prob_m: {
    fullName: "Marker Positivity (M+)",
    definition: "Marker positivity, or probability of positive test result for biomarker."
  },
  q_sens: {
    fullName: "Quality of the sensitivity",
    definition: "Increase in sensitivity versus a random test, fixing test positivity. Formula: Danger*=ybar=sens-p."
  },
  q_spec: {
    fullName: "Quality of the specificity",
    definition: "Increase in specificity versus a random test, fixing test positivity."
  },
  reassurance: {
    fullName: "Reassurance",
    definition: "Reduction in disease risk from testing negative. Formula: Reassurance = P(D+)-cNPV."
  },
	Risk : {
		fullName : "Risk",
		definition : "Probability of disease, implicitly prevalent disease, or incident disease within an interval."
	},
	ROC : {
		fullName : "Receiver operator characteristic (ROC) curve",
		definition : "A presentation that plots a point for all possible thresholds of the biomarker, with the y-axis representing sensitivity and the x-axis representing 1 - <i>specificity</i> of the test.  The ROC curve graphically displays the tradeoff of increased sensitivity but decreased specificity from lowering the threshold, and vice versa."
	},
	Sens : {
		fullName : "Sensitivity",
		definition : "Sensitivity is the proportion whose biomarker test is positive (above the threshold) among those who are positive for disease."
	},
	Spec : {
		fullName : "Specificity",
		definition : "Specificity is the proportion whose biomarker test is negative (below the threshold) among those without disease."
	}
});
$.extend($_Glossary, {
  cnpv: $_Glossary.cNPV,
	ppv : $_Glossary.PPV,
	sens : $_Glossary.Sens,
	spec : $_Glossary.Spec
});
