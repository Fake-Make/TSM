const CARROT_UFO = [28.61, 30.1, 33.69, 34.47, 34.64, 34.67, 33.71, 34.29, 34.15, 33.92, 33.93, 33.23, 33.17, 33.02, 32.43, 31.72, 30.85, 29.55, 28.28, 27.61, 27.41, 27.27, 26.65, 25.39, 25.01, 25.26, 25.57, 26.76, 27.88, 27.97, 26.34, 23.63, 21.94, 18.82, 17.5, 16.46, 14.32, 13.04, 12.55, 11.99, 12.14, 12.05, 12, 11.82, 12.25, 12.77, 12.81, 13.1, 13, 13.44, 13.73, 13.87, 13.9, 13.9, 13.85, 13.86, 13.96, 13.6, 13.48, 13.55, 13.51, 13.4, 13.43, 13.44, 13.45, 12.86, 12.93, 12.57, 12.55, 12.88, 13.39, 13.44, 13.84, 14.19, 14.42, 14.74, 14.64, 16.89, 19.29, 23.86, 24.96, 25.58, 25.79, 24.5, 23.53, 23.47, 22.08, 21.54, 20.44, 20.66, 20.67, 21.19, 21.21, 20.82, 20.31, 20.99, 20.92, 21.28, 21.32, 21.38, 21.41, 21.68, 21.42, 21.57, 22.08, 22.58, 22.87, 22.89, 23, 23.01, 23.93, 24.04, 24.29, 24.35, 24.77, 25.66, 26.11, 27.24, 28.02, 28.25, 30.19, 31.49, 32.13, 33.64, 34.78, 36.89, 39.24, 40.34, 41.3, 43.86, 46.05, 45.73, 42.58, 38.2, 32.05, 31.02, 26.86, 22.8, 21.5, 20.69, 19.15, 17.03, 15.85, 15.83, 16.02, 17.11, 18.19, 18.55, 18.7, 19.67, 20.32, 20.44, 21.04, 21.26, 22.12, 22, 22.04, 22.41, 23.07, 23.51, 24.32, 26.87, 28.82, 30.27, 30.07, 31.25, 31.44, 31.06, 30.8, 30.83, 30.95, 30.98, 30.98, 30.78, 30.73, 31.11, 31.02, 31.78, 32.92, 34, 34.85, 35.45, 35.44, 36.99, 36.35, 33.24, 29.32, 27.08, 24.47, 20.43, 19.15, 16.78, 15.62, 17.02, 16.65, 17.21, 18.25, 18.6, 18.64, 19.66, 20.23, 20.99, 22.34, 22.08, 23.42, 23.01, 22.82, 23.29, 23.67, 24.47, 25.17, 24.74, 25.18, 25.46, 25.14, 25.68, 24.12, 24.24, 25.28, 25.43, 24.99, 25, 24.29, 23.37, 22.86, 23.21, 23.86, 24.2, 23.84, 24.23, 28.44, 29.75, 30.21, 29.71, 30.19, 29.22, 27.46, 25.53, 24.01, 20.53, 19, 17.21, 16.19, 15.61, 15.79, 15.87, 16.66, 16.18, 17.38, 17.97, 18.49, 19.22, 19.19, 19.39, 19.23, 19.4, 19.23, 19.4, 19.3, 19.53];
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
	var trendFunction = t => 3e-4 * Math.pow(t + 1, 2) - 0.0425 * (t + 1) + 27.872;
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
			seasonLine[i] = seasonLine[i % seasons];
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
