const CARROT_UFO = [30.44, 31.38, 32.18, 32.78, 33.31, 33.68, 34.21, 34.59, 34.97, 35.25, 35.56, 35.67, 35.7, 35.67, 35.57, 35.48, 35.07, 34.83, 34.77, 34.63, 34.24, 33.22, 32.66, 32.2, 31.62, 31.02, 30.64, 29.88, 28.46, 27.52, 26.36, 25.13, 23.73, 22.4, 21.12, 20.15, 19.21, 18.65, 17.97, 17.47, 17.06, 16.71, 16.49, 16.28, 16.11, 16.04, 16, 15.98, 15.97, 15.95, 16.01, 15.98, 16.05, 16.04, 16.06, 16.3, 16.33, 16.41, 16.44, 16.38, 16.38, 16.44, 16.43, 16.37, 16.29, 16.32, 16.26, 16.29, 16.39, 16.68, 17.18, 18.09, 19.47, 21.4, 23.4, 24.79, 25.55, 26.22, 26.88, 27.55, 27.51, 26.18, 24.65, 23.04, 21.98, 20.89, 19.94, 18.96, 18.25, 17.63, 17.13, 16.7, 16.33, 16.11, 16.04, 15.99, 15.98, 16.05, 16.18, 16.32, 16.5, 16.77, 17.66, 18.07, 18.51, 18.86, 19.04, 19.24, 19.41, 19.53, 19.66, 19.89, 20.07, 20.24, 20.54, 21.01, 21.57, 22.34, 23.54, 25.01, 26.97, 28.78, 29.7, 30.31, 30.49, 30.62, 30.55, 30.46, 30.25, 30.35, 30.19, 29.69, 28.64, 27.15, 25.68, 24.37, 22.88, 21.69, 20.56, 19.82, 19.52, 19.43, 19.75, 20.17, 20.4, 20.39, 20.44, 20.59, 20.65, 20.72, 20.88, 21.04, 21.39, 21.81, 22.86, 23.69, 24.28, 24.61, 25.56, 26.51, 27.58, 28.44, 29.15, 29.52, 29.85, 30.09, 30.28, 30.42, 30.54, 31.01, 31.8, 33.15, 34.96, 36.14, 36.32, 35.55, 34.53, 33.14, 32.29, 31.67, 31.25, 30.67, 29.5, 28, 26.31, 24.57, 23.13, 22.18, 21.29, 20.62, 20.23, 20.27, 20.51, 20.98, 21.42, 21.84, 22.53, 22.98, 23.49, 23.92, 24.36, 24.79, 25.5, 26.48, 27.77, 30.37, 32.19, 33.9, 35.17, 36.27, 37.37, 38.01, 38.08, 38.16, 38.05, 37.82, 37.47, 37.36, 37.37, 37.93, 39.22, 40.23, 40.8, 41.5, 41.34, 39.92, 38.32, 37.02, 36.3, 36.22, 36.23, 35.91, 35.63, 34.86, 33.47, 31.91, 29.81, 27.52, 25.73, 24.71, 24.13, 24.13, 24.26, 24.38, 24.25, 24.1, 24, 23.91, 24.02, 24.02, 23.97, 24.15, 24.4, 24.41, 24.58, 24.81, 25.2, 25.42, 25.5, 25.57, ];
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
			b: 20,
			l: 20
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
			b: 20,
			l: 20
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
	var trendFunction = t => 5e-4 * Math.pow(t + 1, 2) - 0.1078 * (t + 1) + 28.112;
	var trendLine = {
		x: CARROT_UFO_X,
		y: CARROT_UFO_X.map(t => trendFunction(t)),
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
			b: 20,
			l: 20,
			r: 0
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
			seasonLine[i] = seasonLine[i % seasons] - shift;
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
			b: 20,
			l: 20,
			r: 0
		}
	};
	Plotly.newPlot(seasonPlot, [seasonData], seasonLayout);
}

{	// Leftover plot
	var leftoverPlot = document.getElementById('model-leftover');
	var leftoverLine = {
		x: CARROT_UFO_X,
		y: CARROT_UFO.map((price, t) => price - trendFunction(t) - seasonLine[t]),
		name: 'Остатки'
	}
	var leftoverLayout = {
		title:'График остатков',
		margin: {
			t: 30,
			b: 20,
			l: 20,
			r: 0
		}
	};
	Plotly.newPlot(leftoverPlot, [leftoverLine], leftoverLayout);
}

{	// Forecast plot
	var forecastPlot = document.getElementById('forecast-plot');

	const quarter = 3 * 4;
	var forecast_x = Array.from(Array(N + quarter).keys());
	var forecastLine = {
		x: forecast_x,
		y: forecast_x.map((_, t) => trendFunction(t) + seasonLine[t % seasons]),
		name: 'Прогноз'
	}
	var forecastLayout = {
		title:'Прогноз на квартал вперёд',
		margin: {
			t: 30,
			b: 20,
			l: 20
		}
	};
	Plotly.newPlot(forecastPlot, slicePerYear(CARROT_UFO).concat([forecastLine]), forecastLayout);
}

let constDevider = autoCovariance(0);
	const AUTO_CORELLATION = CARROT_UFO_X.map((_, index) => autoCovariance(index) / constDevider);
$(window).resize(() => {
	Plotly.newPlot(basicPlot, slicePerYear(CARROT_UFO), basicLayout);
	Plotly.newPlot(autoCorellationPlot, slicePerYear(AUTO_CORELLATION).map(part => {
		part.type = 'bar';
		delete part.mode;
		return part;
	}), autoCorellationLayout);
	Plotly.newPlot(trendPlot, trendData, trendLayout);
	Plotly.newPlot(seasonPlot, [seasonData], seasonLayout);
	Plotly.newPlot(leftoverPlot, [leftoverLine], leftoverLayout);
	Plotly.newPlot(forecastPlot, slicePerYear(CARROT_UFO).concat([forecastLine]), forecastLayout);
});
