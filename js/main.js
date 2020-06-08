const CARROT_UFO = [34.26, 34.91, 35.38, 36.25, 36.42, 36.54, 37.02, 37.15, 37.15, 37.26, 37.72, 37.95, 38.05, 38.26, 38.82, 39.14, 38.65, 38.95, 39.05, 38.85, 38.97, 38.62, 38.09, 37.44, 38.14, 38.39, 38.89, 39.2, 38.67, 37.67, 36.45, 35.12, 32.7, 30.55, 28.56, 27.28, 26.2, 25.57, 24.53, 23.71, 23.46, 23.07, 22.76, 22.58, 22.45, 22.39, 22.44, 22.6, 22.4, 22.41, 22.44, 22.22, 22.28, 22.29, 22.27, 19.48, 19.37, 19.31, 19.5, 19.52, 19.52, 19.54, 19.66, 19.71, 19.86, 20.07, 20.21, 20.59, 20.65, 20.9, 21.15, 21.58, 22.05, 23.18, 24.45, 25.74, 26.73, 27.88, 29.13, 30.69, 31.59, 32.3, 33.16, 32.46, 32, 31.19, 30.44, 29.48, 28.72, 27.5, 26.85, 26.45, 26.23, 25.94, 25.47, 25.81, 25.51, 25.17, 25.18, 25.18, 25.22, 25.39, 25.74, 26.03, 26.33, 26.76, 27.56, 28, 28.16, 28.4, 28.84, 28.97, 29.25, 29.52, 29.8, 29.98, 30.38, 30.81, 31.07, 31.46, 31.82, 32.6, 32.89, 33.13, 33.59, 34.03, 35.06, 36.02, 37.34, 38.05, 38.68, 38.59, 37.88, 37.11, 35.97, 35.4, 33.13, 31.66, 29.81, 27.79, 26.78, 25.91, 25.66, 25.57, 25.7, 26.18, 26.55, 26.9, 27.1, 27, 27.25, 27.25, 27.69, 28.06, 28.8, 29.13, 29.41, 28.3, 28.64, 29.02, 29.47, 29.91, 30.11, 30.64, 31.22, 31.73, 32.45, 32.6, 33.1, 33.34, 33.27, 33.64, 34.15, 34.9, 35.91, 36.46, 36.7, 37.92, 38.09, 37.85, 38.01, 38.37, 38.79, 37.82, 35.85, 34.3, 32.46, 31.24, 29.66, 28.49, 27.27, 26.61, 26.3, 25.86, 26.37, 26.89, 27.93, 28.42, 29.3, 29.65, 30.04, 30.26, 30.83, 31.74, 32.78, 34.98, 36.54, 38.08, 39.66, 40.75, 41.59, 42.16, 42.58, 42.64, 42.79, 43.32, 43.44, 43.98, 44.13, 44.94, 46.23, 46.91, 47.86, 48.47, 48.84, 49.74, 49.37, 49.33, 50.89, 52.55, 53.33, 54.81, 56.1, 58, 57.03, 54.47, 50.8, 47.79, 44.46, 41.24, 38.37, 36.48, 34.24, 33.84, 32, 31.08, 31.34, 30.75, 30.37, 30.26, 29.64, 29.4, 29.43, 29.79, 29.82, 30.01, 30.53, 30.69, 31.13, 31.5];
const N = CARROT_UFO.length;
const CARROT_UFO_X = Array.from(Array(N).keys());
const CARROT_UFO_SORTED = CARROT_UFO.slice(0).sort();
const mathExpectation = CARROT_UFO.reduce((acc, curr) => acc + curr) / N;
const dispersion = CARROT_UFO.reduce((acc, curr) => acc + Math.pow((curr - mathExpectation), 2)) / (N - 1);
const quantile = -0.74;

function slicePerYear(sourceArray) {
	const firstYear = 2011;
	const weeksAtYear = 51;
	let sourceArray_X = Array.from(Array(sourceArray.length).keys());
	var destArray = [];

	var fullYears = Math.floor(N / weeksAtYear);
	let year = 0;
	for(; year < fullYears; year++) {
		destArray.push({
			x: sourceArray_X.slice(year * weeksAtYear, (year + 1) * weeksAtYear + 1),
			y: sourceArray.slice(year * weeksAtYear, (year + 1) * weeksAtYear + 1),
			mode: 'lines',
			name: firstYear + year
		});
	}
	if (N % weeksAtYear) {
		destArray.push({
			x: sourceArray_X.slice(year * weeksAtYear),
			y: sourceArray.slice(year * weeksAtYear),
			mode: 'lines',
			name: firstYear + year
		});
	}
	return destArray;
}

{	// Basic plot
	var basicPlot = document.getElementById('basic');
	var basicLayout = {
		title:'График исходного ряда',
		margin: {
			t: 30,
			b: 20
		}
	};
	Plotly.newPlot(basicPlot, slicePerYear(CARROT_UFO), basicLayout);
}

{	// Sets criteria
	let med = N % 2 ?
		CARROT_UFO_SORTED[(N + 1) / 2 + 1] :
		(CARROT_UFO_SORTED[N/2 + 1] + CARROT_UFO_SORTED[N/2 + 2]) / 2;
	let symbols = CARROT_UFO.map(value => value > med);
	let setsAmount = 1, maxSet = 0;
	for (let i = 1, curSet = 1; i < N; i++) {
		if (symbols[i] === symbols[i - 1]) {
			curSet++;
		} else {
			maxSet = curSet > maxSet ? curSet : maxSet;
			curSet = 1;
			setsAmount++;
		}
	}
	let vCheck = Math.floor((N + 2 - quantile * Math.sqrt(N - 1)) / 2);
	let tCheck = Math.floor(1.43 * Math.log(N + 1));
	const criteriaSets = setsAmount < vCheck || setsAmount === vCheck || maxSet > tCheck || maxSet === tCheck;
	const hypothesisSets = !criteriaSets;

	$(".sets-amount").html(setsAmount);
	$(".max-set").html(maxSet);
	$(".v-check").html(
		setsAmount > vCheck || setsAmount === vCheck ?
		`𝑣 = ${setsAmount} ≥ ${vCheck}` :
		`𝑣 = ${setsAmount} < ${vCheck}`
	);
	$(".t-check").html(
		maxSet > tCheck || maxSet === tCheck ?
		`𝑣 = ${maxSet} ≥ ${tCheck}` :
		`𝑣 = ${maxSet} < ${tCheck}`
	);
	$('.sets-criteria').html(
		hypothesisSets ?
		'принимается' :
		'отвергается'
	);
}

{	// Abbe criteria
	let qSquared = 0;
	for (let i = 0; i < N - 1; qSquared += Math.pow(CARROT_UFO[i + 1] - CARROT_UFO[i], 2), i++);
	qSquared /= 2 * (N - 1);

	let left = qSquared / dispersion;
	let right = 1 + quantile / Math.sqrt(N + (1 + Math.pow(quantile, 2)) / 2);
	const criteriaAbbe = left < right || left === right;
	const hypothesisAbbe = !criteriaAbbe;

	$(".abbe-check").html(
		left > right || left === right ?
		`A = ${left.toFixed(5)} ≥ ${right.toFixed(5)}` :
		`A = ${left.toFixed(5)} < ${right.toFixed(5)}`
	);
	$('.abbe-criteria').html(
		hypothesisAbbe ?
		'принимается' :
		'отвергается'
	);
}

{	// Auto-corellation plot
	function autoCovariance(index) {
		let sum = 0;
		for (let i = 0; i < N - index; i++) {
			sum += (CARROT_UFO[i] - mathExpectation) * (CARROT_UFO[i + index] - mathExpectation);
		}
		return sum / (N - index);
	}

	let constDevider = autoCovariance(0);
	const AUTO_CORELLATION = CARROT_UFO_X.map((_, index) => autoCovariance(index) / constDevider);
	CARROT_UFO.map((_, index) => autoCovariance(index) / constDevider);

	var autoCorellationPlot = document.getElementById('auto-corellation');
	var autoCorellationLayout = {
		title:'График автокорреляционной функции временного ряда',
		margin: {
			t: 30,
			b: 20
		}
	};
	Plotly.newPlot(autoCorellationPlot, slicePerYear(AUTO_CORELLATION).map(part => {
		part.type = 'bar';
		delete part.mode;
		return part;
	}), autoCorellationLayout);
}

{	// Trend plot
	var trendPlot = document.getElementById('model-trend');
	var trendLine = {
		x: CARROT_UFO_X,
		y: CARROT_UFO_X.map(t => 6e-4 * Math.pow(t + 1, 2) - 0.1107 * (t + 1) + 33.617),
		name: 'Тренд',
		mode: 'lines',
		line: {
			color: '#000',
			width: 1
		}
	};
	var trendData = slicePerYear(CARROT_UFO).concat([trendLine]);
	var trendLayout = {
		title:'График линии тренда',
		margin: {
			t: 30,
			b: 20
		}
	};
	Plotly.newPlot(trendPlot, trendData, trendLayout);
}

{	// Season plot
	var seasonPlot = document.getElementById('model-season');
	{	// Get season line (really hard)
		// Get correction of trend
		var seasonLine = CARROT_UFO.map((val, t) => val - trendLine.y[t]);
		// Get average per week
		var period = slicePerYear(seasonLine);
		var seasons = period[0].y.length;
		var periods = period.length;
		let i = 0;
		// Notice last period with just a few seasons
		for (; i < period[periods - 1].y.length; i++) {
			seasonLine[i] = period.reduce((acc, cur) => acc + cur.y[i], 0) / periods;
		}
		for (; i < seasons; i++) {
			seasonLine[i] = period.reduce((acc, cur) => acc + (cur.y[i] || 0), 0) / (periods - 1);
		}
		// Get shift from zero-sum
		let shift = seasonLine.slice(0, seasons + 1).reduce((acc, cur) => acc + cur) / seasons;
		for (i = 0; i < seasons; seasonLine[i++] -= shift);
		// Repeat for left of seasons around whole periods
		for (; i < seasonLine.length; i++) {
			seasonLine[i] = seasonLine[i - seasons] - shift;
		}
	}

	var seasonData = {
		x: CARROT_UFO_X,
		y: seasonLine,
		name: 'Сезонная компонента'
	}
	
	var seasonLayout = {
		title:'График сезонной компоненты',
		margin: {
			t: 30,
			b: 20
		}
	};
	Plotly.newPlot(seasonPlot, [seasonData], seasonLayout);
}

{	// Leftover plot
	var leftoverPlot = document.getElementById('model-leftover');
	var leftoverLine = {
		x: CARROT_UFO_X,
		y: CARROT_UFO.map((price, t) => price - trendLine.y[t] - seasonLine[t]),
		name: 'Остатки'
	}
	var leftoverLayout = {
		title:'График остатков',
		margin: {
			t: 30,
			b: 20
		}
	};
	Plotly.newPlot(leftoverPlot, [leftoverLine], leftoverLayout);
}

{	// Forecast plot
	var forecastPlot = document.getElementById('forecast-plot');
	var forecastLine = {
		x: CARROT_UFO_X,
		y: CARROT_UFO.map((price, t) => price - trendLine.y[t] - seasonLine[t]),
		name: 'Остатки'
	}
	var forecastLayout = {
		title:'Прогноз на квартал вперёд',
		margin: {
			t: 30,
			b: 20
		}
	};
	Plotly.newPlot(forecastPlot, [forecastLine], forecastLayout);
}
