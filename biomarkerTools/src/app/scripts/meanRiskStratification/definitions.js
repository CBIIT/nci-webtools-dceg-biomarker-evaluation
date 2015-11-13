$.extend($_Glossary, {
	AUC : {
		fullName : "Area under the receiver operator characteristic curve",
		definition : " for a biomarker is the average sensitivity (or, equivalently, the integral of the sensitivity) in the interval of cSpecificity from 0 to 1 (specificity from 1 to 0), itself equal to the area between the ROC curve and the x-axis."
	},
  cnpv: {
    fullName: "Complement of Negative Predictive Value (cNPV)",
    definition: "Probability of disease, given a negative test result from biomarker. Unlike sensitivity and specificity, cNPV's reflect disease prevalence and is useful for risk stratification."
  },
  concern: {
    fullName: "Concern",
    definition: "Increase in disease risk from testing positive. Formula: Concern = PPV-P(D+)"
  },
  d_neg: {
    fullName: "Disease Negative (D-)",
    definition: "Does not have disease"
  },
  max_mrs: {
    fullName: "Maximum possible MRS for a disease with this prevalence",
    definition: "Maximum possible MRS for a disease with this prevalence. Formula: max risk strat=2q(1-q)"
  },
  m_neg: {
    fullName: "Marker Negativity (M-)",
    definition: "Negative test result for biomarker test"
  },
  mrs: {
    fullName: "Mean Risk Stratification (MRS)",
    definition: "Average change in pretest-posttest disease risk. Formula: MRS=2tp(1-p)"
  },
  nnr: {
    fullName: "Number Needed to Recruit",
    definition: "To detect 1 more disease case in positive group than negative group. Formula: NNR = 1/PBS"
  },
  nns: {
    fullName: "Number Needed to Screen",
    definition: "Definition for number needed to screen. Formula: Usual NNS = 1/RD"
  },
  npv: {
    fullName: "Negative Predictive Value (NPV)",
    definition: "Definition for NPV"
  },
  pbs: {
    fullName: "Population Burden Stratification (PBS)",
    definition: "Extra disease detection in positive group than negative group. " +
    "Formula: PBS = a-b"
  },
	ppv : {
		fullName : "Positive Predictive Value (PPV)",
		definition : "Probability of disease, given a positive test result from biomarker.  Unlike sensitivity and specificity, PPV’s reflect disease prevalence and is useful for risk stratification."
	},
  prob_d: {
    fullName: "Disease Positive (D+)",
    definition: "Disease prevalence, or probability of disease"
  },
  prob_m: {
    fullName: "Marker Positivity (M+)",
    definition: "Marker positivity, or probability of positive test result for biomarker"
  },
  q_sens: {
    fullName: "Quality of the sensitivity",
    definition: "Increase in sensitivity versus a random test, fixing test positivity. Formula: Danger*=ybar=sens-p"
  },
  q_spec: {
    fullName: "Quality of the specificity",
    definition: "Increase in specificity versus a random test, fixing test positivity"
  },
  reassurance: {
    fullName: "Reassurance",
    definition: "Reduction in disease risk from testing negative. Formula: Reassurance = P(D+)-cNPV"
  },
	sens : {
		fullName : "Sensitivity",
		definition : "Sensitivity is the proportion whose biomarker test is positive (above the threshold) among those who are positive for disease."
	},
	spec : {
		fullName : "Specificity",
		definition : "Specificity is the proportion whose biomarker test is negative (below the threshold) among those without disease."
  }
});

$(document).ready(function() {
  thisTool.find("select").on('change', function() {
    $(this).parent().prev().attr('data-term',$(this).val());
  });
});
