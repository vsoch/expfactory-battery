
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function normal_random(mean, variance) {
  if (mean == undefined)
    mean = 0.0;
  if (variance == undefined)
    variance = 1.0;
  var V1, V2, S;
  do {
    var U1 = Math.random();
    var U2 = Math.random();
    V1 = 2 * U1 - 1;
    V2 = 2 * U2 - 1;
    S = V1 * V1 + V2 * V2;
  } while (S > 1);

  X = Math.sqrt(-2 * Math.log(S) / S) * V1;
//Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
  X = mean + Math.sqrt(variance) * X;
//Y = mean + Math.sqrt(variance) * Y ;
  return X;
}

var get_condition = function() {
	return condition
}

var get_current_trial = function() {
	return current_trial
}

var initialize_FB_matrix = function() {
	return [Math.random()*.5+.25,Math.random()*.5+.25,Math.random()*.5+.25,Math.random()*.5+.25]
}



/*
Generate first stage stims. Takes in an array of images and colors (which change between practice anad test),
as well as a "condition" string that is used in the data object
*/
var get_fs_stim = function(images, colors, condition) {
	var fs_stim = [
		{stimulus: 
			"<div class = decision-left style='background:" + colors[0] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[0] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[0] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[1] + "'></img></div>",
		data: {exp_id: "two-stage-decision", trial_id: condition + '_first_stage', condition: [0,1]}},
		{stimulus: 
			"<div class = decision-left style='background:" + colors[0] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[1] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[0] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[0] + "'></img></div>",
			data: {exp_id: "two-stage-decision", trial_id: condition +'_first_stage', condition: [1,0]}}						
	]	
	return fs_stim
}

/*
Generate second stage stims. Takes in an array of images and colors (which change between practice anad test),
as well as a "condition" string that is used in the data object
*/
var get_ss_stim = function(images, colors, condition) {
	var ss_stim_array = [
			["<div class = decision-left style='background:" + colors[1] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[2]+ "'></img></div>" + 
			"<div class = decision-right style='background:" + colors[1] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[3]+ "'></img></div>",
			"<div class = decision-left style='background:" + colors[1] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[3]+ "'></img></div>" + 
			"<div class = decision-right style='background:" + colors[1] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[2]+ "'></img></div>"],
			["<div class = decision-left style='background:" + colors[2] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[4]+ "'></img></div>" + 
			"<div class = decision-right style='background:" + colors[2] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[5]+ "'></img></div>",
			"<div class = decision-left style='background:" + colors[2] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[5]+ "'></img></div>" + 
			"<div class = decision-right style='background:" + colors[2] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + images[4]+ "'></img></div>"]
	]	

	var ss_stim = {
		stimulus: [ss_stim_array[0][0], ss_stim_array[0][1], ss_stim_array[1][0], ss_stim_array[1][1]],
		data: [{exp_id: "two-stage-decision", trial_id: condition +'_second_stage', condition: [2,3]},
			{exp_id: "two-stage-decision", trial_id: condition +'_second_stage', condition: [3,2]},
			{exp_id: "two-stage-decision", trial_id: condition +'_second_stage', condition: [4,5]},
			{exp_id: "two-stage-decision", trial_id: condition +'_second_stage', condition: [5,4]}]
	}	
	return ss_stim
}


/*
The following methods all support the user-dependent presentation of stimuli including animations, multiple stages
and FB. The "get_selected" functions also append data to the preceeding trials
*/

/* Selects the next first stage from a predefined, randomized list of first stages and increases the trial count*/
var choose_first_stage = function() {
	current_trial = current_trial + 1
	return curr_fs_stims.stimulus.shift()
}

/*
After a stimuli is selected, an animation proceeds whereby the selected stimulus moves to the top of the screen while
the other stimulus fades. This function accomplishes this by creating a new html object to display composed of the old stim
with appropriate handles to start the relevant animations.

Also updates the global variables action, first_selected and first_notselected, which are used in the next function
*/
var get_first_selected = function() {	
	var global_trial = jsPsych.progress().current_trial_global
	var first_stage_trial = jsPsych.data.getData()[global_trial-1]
	var stim_ids = curr_fs_stims.data[current_trial].condition
	action = actions.indexOf(first_stage_trial.key_press)
	jsPsych.data.addDataToLastTrial({condition: stim_ids, trial_num: current_trial})
	if (action != -1) {
		first_selected = stim_ids[action]
		first_notselected = stim_ids[1-action]
		return "<div class = 'selected " + stim_side[action] + "' style='background:" + curr_colors[0] + "; width:330px;height:230px;'>" +
				"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
			"<div class = '" + stim_side[1-action] + " fade' style='background:" + curr_colors[0] + "; width:330px;height:230px;'>" +
			"<img class = 'decision-stim  fade' src= '" + curr_images[first_notselected] + "'></div>"
	} else {
		first_selected = -1
		first_notselected = -1
	}
}

/*
The second stage is probabilistically chosen based on the first stage choice. Each of the first stage stimuli is primarily associated
with one of two second stages, but the transition is ultimately probabilistic.

This function checks to see if there was any first stage response. If not, set the global variable FB_on to off and display a reminder
If an action was taken, display the chosen stimulus at the top of the screen and select a second stage (choosing the one associated with the
action 70% of the time). Randomly select a presentation order for the two stimuli associated with the second stage
*/
var choose_second_stage = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var first_stage_trial = jsPsych.data.getData()[global_trial-2]
	var stim_ids = curr_fs_stims.data[current_trial].condition
	if (action == -1) {
		FB_on = 0;
		return "<div class = centerbox style = text-align:center><p style = font-size:30px>" +
	 							"Please respond faster </p></div>"
	 }
	else {FB_on = 1;
		stage = stim_ids[action]
		if (Math.random() < .3) {stage = 1-stage}
		stage_tmp = stage * 2
		return "<div class = 'decision-top-background faded' style='background:" + curr_colors[0] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" + 
			curr_ss_stim.stimulus[stage_tmp + Math.round(Math.random())]}
}

/*
Animates second stage choice, similarly to get_first_selected
*/
var get_second_selected = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var second_stage_trial = jsPsych.data.getData()[global_trial-1]
	var slice_start_index = second_stage_trial.stimulus.search('<div class = decision-left')
	var stim_index = curr_ss_stim.stimulus.indexOf(second_stage_trial.stimulus.slice(slice_start_index))
	var stim_ids = curr_ss_stim.data[stim_index].condition
	action = actions.indexOf(second_stage_trial.key_press)
	jsPsych.data.addDataToLastTrial({condition: stim_ids, trial_num: current_trial})
	if (action != -1) {
		second_selected = stim_ids[action]
		second_notselected = stim_ids[1-action]
		return "<div class = '"  + stim_side[action] + " selected' style='background:" + curr_colors[stage+1] +"; width:330px;height:230px;'>" +
				"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
				"<div class = 'fade "  + stim_side[1-action] + "' style='background:" + curr_colors[stage+1] +"; width:330px;height:230px;'>" +
				"<img class = 'decision-stim' src= '" + curr_images[second_notselected] + "'></div>"
	} else {
		second_selected = -1
		second_notselected = -1
	}
}

/*
After each trial the FB_matrix is updated such that each of the 4 reward probabilities changes by a random amount
parametrized a Gaussian. Reward probabilities are bound by 25% and 75%
*/
var update_FB = function() {
	for (i = 0; i < FB_matrix.length; i++) {
		var curr_value = FB_matrix[i]
		var step = normal_random(0,.025*.025)
		if (curr_value+step < .75 && curr_value+step > .25) {FB_matrix[i] = curr_value+step}
		else {FB_matrix[i] = curr_value - step}
	}
}

/*
If no action was taken during the second stage display a reminder.
Otherwise, check the FB_matrix which determines the reward probabilities for each stimulus (there are 4 final stimuli associated with rewards:
2 for each of the 2 second stages). Flip a coin using the relevant probability and give FB.

After FB, the FB_atrix is updated.
*/
var get_feedback = function() {
	if (action == -1) {return "<div class = centerbox style = text-align:center><p style = font-size:30px>" +
	 							"Please respond faster </p></div>"}
	else if (Math.random() < FB_matrix[second_selected-2]) {
		update_FB();
		FB = 1
		return "<div class = 'decision-top-background faded' style='background:" + curr_colors[stage+1] +"; width:330px;height:230px;'>" +
			"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
			"<div><img  class = decision-fb src = 'static/images/2-stage-decision/gold_coin.png'></img></div>"
	}
	else {
		update_FB(); 
		FB = 0
		return "<div class = 'decision-top-background faded' style='background:" + curr_colors[stage+1] +"; width:330px;height:230px;'>" +
		"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
			"<div style = text-align:center><p class = decision-fb style = 'color:red;font-size:60px'>0</p></div>"
	}
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

//define global variables
var practice_trials_num = 10
var test_trials_num = 200
var current_trial = -1 
var first_selected = -1 //Tracks the ID of the selected fs stimuli
var first_notselected = -1 //The fs stimuli not selected
var second_selected = -1 //Tracks the ID of the selected fs stimuli
var second_notselected = -1 //The fs stimuli not selected
var action = -1 //tracks which action was last taken
var FB_on = 1 //tracks whether FB should be displayed on this trial
var FB = -1 //tracks FB value
var stage = 0 //stage is used to track which second stage was shown, 0 or 1
var FB_matrix = initialize_FB_matrix() //tracks the reward probabilities for the four final stimuli

// Actions for left and right
var actions = [37,39]
var stim_side = ['decision-left', 'decision-right']
var stim_move = ['selected-left', 'selected-right']

// Set up colors
var test_colors = jsPsych.randomization.shuffle(['#98bf21', '#FF9966', '#C2C2FF'])
var practice_colors = jsPsych.randomization.shuffle(['#F1B8D4', '#CCFF99', '#E0C2FF'])
var curr_colors = test_colors

//The first two stims are first-stage stims.
//The next four are second-stage
var test_images = jsPsych.randomization.repeat(
	["static/images/2-stage-decision/11.png",
	 "static/images/2-stage-decision/12.png",
	 "static/images/2-stage-decision/13.png",
	 "static/images/2-stage-decision/14.png",
	 "static/images/2-stage-decision/15.png",
	 "static/images/2-stage-decision/16.png",],1)

var practice_images = jsPsych.randomization.repeat(
	["static/images/2-stage-decision/80.png",
	 "static/images/2-stage-decision/81.png",
	 "static/images/2-stage-decision/82.png",
	 "static/images/2-stage-decision/83.png",
	 "static/images/2-stage-decision/84.png",
	 "static/images/2-stage-decision/85.png",],1)

var curr_images = test_images

var test_fs_stim = get_fs_stim(test_images,test_colors,'test')
var test_ss_stim = get_ss_stim(test_images,test_colors,'test')

var test_fs_stims = jsPsych.randomization.repeat(test_fs_stim, test_trials_num, true);
var curr_fs_stims = test_fs_stims
var curr_ss_stim = test_ss_stim


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the simon experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>If you see red, press the.</p><p class = block-text>Use the <strong>right arrow key</strong> to advance through the instructions. You can go back using the <strong>left arrow key</strong>.</p></div>',
	'<div class = centerbox><p class = block-text>If you see blue, press the.</p><p class = block-text>Use the <strong>right arrow key</strong> to advance through the instructions. You can go back using the <strong>left arrow key</strong>.</p></div>'
	]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var intertrial_wait = {
	type: "single-stim",
	stimuli: "",
	continue_after_response: false,
	is_html: true,
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000
}


//experiment blocks
var first_stage = {
		type: "single-stim",
		stimuli: choose_first_stage,
		is_html: true,
		choices: actions,
		timing_stim: 2000,
		timing_response: 2000,
		show_response: true,
		timing_post_trial: 0,
		trial_count: get_current_trial,
		data: {exp_id: "two-stage-decision", trial_id: 'first_stage'}
}

var first_stage_selected = {
	type: "single-stim",
	stimuli: get_first_selected,
	continue_after_response: false,
	is_html: true,
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000
}

var second_stage = {
		type: "single-stim",
		stimuli: choose_second_stage,
		is_html: true,
		choices: actions,
		timing_stim: 2000,
		timing_response: 2000,
		timing_post_trial: 0,
		trial_count: get_current_trial,
		data: {exp_id: "two-stage-decision", trial_id: 'second_stage'}
}	

var second_stage_selected = {
	type: "single-stim",
	stimuli: get_second_selected,
	continue_after_response: false,
	is_html: true,
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000
}

var FB_stage = {
		type: "single-stim",
		stimuli: get_feedback,
		is_html: true,
		choices: actions,
		timing_stim: 500,
		timing_response: 500,
		continue_after_response: false,
		timing_post_trial: 0,
		trial_count: get_current_trial,
		data: {exp_id: "two-stage-decision", trial_id: 'FB_stage'}
}	

var FB_chunk = {
	chunk_type: 'if',
	timeline: [second_stage_selected, FB_stage, intertrial_wait],
	conditional_function: function() {
		return FB_on == 1
	}
}

var noFB_chunk = {
	chunk_type: 'if',
	timeline: [intertrial_wait],
	conditional_function: function() {
		return FB_on == 0
	}
}

var two_stage_experiment = []
//two_stage_experiment.push(welcome_block);
//two_stage_experiment.push(instructions_block);

for (var i = 0; i < 10; i ++ ) {
	two_stage_experiment.push(first_stage)
	two_stage_experiment.push(first_stage_selected)
	two_stage_experiment.push(second_stage)
	two_stage_experiment.push(FB_chunk)
	two_stage_experiment.push(noFB_chunk)
}











