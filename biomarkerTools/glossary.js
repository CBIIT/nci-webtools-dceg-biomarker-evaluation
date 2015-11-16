$.extend($_Glossary,{
	AUC : {
		fullName : "Area under the receiver operator characteristic curve",
		definition : " for a biomarker is the average sensitivity (or, equivalently, the integral of the sensitivity) in the interval of cSpecificity from 0 to 1 (specificity from 1 to 0), itself equal to the area between the ROC curve and the x-axis."
	},
	cNPV : {
		fullName : "Complement of Negative Predictive Value (cNPV)",
		definition : "Probability of disease, given a negative test result from biomarker. Unlike sensitivity and specificity, cNPV's reflect disease prevalence and is useful for risk stratification."
	},

	CV : {
		fullName : "Coefficient of Variation",
		definition : "The coefficient of variation is defined as the ratio of the standard deviation to the mean. It shows the extent of variability in relation to mean of the population."
	},

	Delta : {
		fullName : "Delta",
		definition : "The statistic delta is the ratio of the absolute difference in average level of the biomarker between cases and controls in units of standard deviation."
	},
	DP : {
		fullName : "Disease Prevalence",
		definition : "Proportion of the population with disease, or previously diagnosed with disease, at a given time."
	},

	LRP : {
		fullName : "Likelihood Ratio Positive (LR+)",
		definition : "The LR+ is the ratio of the probabilities of a case having a positive test (Sensitivity) and of a control having a positive test (cSpecificity)."
	},
	LRN : {
		fullName : "Likelihood Ratio Negative (LR-)",
		definition : "The LR- is the ratio of the probabilities of the control having a negative test (Specificity) and the case having a negative test (cSensitivity)."
	},

	PPV : {
		fullName : "Positive Predictive Value (PPV)",
		definition : "Probability of disease, given a positive test result from biomarker.  Unlike sensitivity and specificity, PPV's reflect disease prevalence and is useful for risk stratification."
	},
	PPVmcNPV : {
		fullName : "PPV-cNPV",
		definition : "The difference PPV-cNPV is a simple measure of the clinical value of the test, or the difference between risks; if PPV is close to cNPV, the screening test will not be very helpful, even if the sensitivity and specificity are high."
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
