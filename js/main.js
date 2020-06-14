const DATA = [30.44, 31.38, 32.18, 32.78, 33.31, 33.68, 34.21, 34.59, 34.97, 35.25, 35.56, 35.67, 35.7, 35.67, 35.57, 35.48, 35.07, 34.83, 34.77, 34.63, 34.24, 33.22, 32.66, 32.2, 31.62, 31.02, 30.64, 29.88, 28.46, 27.52, 26.36, 25.13, 23.73, 22.4, 21.12, 20.15, 19.21, 18.65, 17.97, 17.47, 17.06, 16.71, 16.49, 16.28, 16.11, 16.04, 16, 15.98, 15.97, 15.95, 16.01, 15.98, 16.05, 16.04, 16.06, 16.3, 16.33, 16.41, 16.44, 16.38, 16.38, 16.44, 16.43, 16.37, 16.29, 16.32, 16.26, 16.29, 16.39, 16.68, 17.18, 18.09, 19.47, 21.4, 23.4, 24.79, 25.55, 26.22, 26.88, 27.55, 27.51, 26.18, 24.65, 23.04, 21.98, 20.89, 19.94, 18.96, 18.25, 17.63, 17.13, 16.7, 16.33, 16.11, 16.04, 15.99, 15.98, 16.05, 16.18, 16.32, 16.5, 16.77, 17.66, 18.07, 18.51, 18.86, 19.04, 19.24, 19.41, 19.53, 19.66, 19.89, 20.07, 20.24, 20.54, 21.01, 21.57, 22.34, 23.54, 25.01, 26.97, 28.78, 29.7, 30.31, 30.49, 30.62, 30.55, 30.46, 30.25, 30.35, 30.19, 29.69, 28.64, 27.15, 25.68, 24.37, 22.88, 21.69, 20.56, 19.82, 19.52, 19.43, 19.75, 20.17, 20.4, 20.39, 20.44, 20.59, 20.65, 20.72, 20.88, 21.04, 21.39, 21.81, 22.86, 23.69, 24.28, 24.61, 25.56, 26.51, 27.58, 28.44, 29.15, 29.52, 29.85, 30.09, 30.28, 30.42, 30.54, 31.01, 31.8, 33.15, 34.96, 36.14, 36.32, 35.55, 34.53, 33.14, 32.29, 31.67, 31.25, 30.67, 29.5, 28, 26.31, 24.57, 23.13, 22.18, 21.29, 20.62, 20.23, 20.27, 20.51, 20.98, 21.42, 21.84, 22.53, 22.98, 23.49, 23.92, 24.36, 24.79, 25.5, 26.48, 27.77, 30.37, 32.19, 33.9, 35.17, 36.27, 37.37, 38.01, 38.08, 38.16, 38.05, 37.82, 37.47, 37.36, 37.37, 37.93, 39.22, 40.23, 40.8, 41.5, 41.34, 39.92, 38.32, 37.02, 36.3, 36.22, 36.23, 35.91, 35.63, 34.86, 33.47, 31.91, 29.81, 27.52, 25.73, 24.71, 24.13, 24.13, 24.26, 24.38, 24.25, 24.1, 24, 23.91, 24.02, 24.02, 23.97, 24.15, 24.4, 24.41, 24.58, 24.81, 25.2, 25.42, 25.5, 25.57];
const N = DATA.length;
const DATA_X = Array.from(Array(N).keys());
const DATA_SORTED = DATA.slice(0).sort();
const mathExpectation = data => data.reduce((acc, curr) => acc + curr) / N;
const dispersion = DATA.reduce((acc, curr) => acc + Math.pow((curr - mathExpectation), 2)) / (N - 1);
const quantile = -0.74;
const chiSquaredAt095 = [0.00393, 0.103, 0.352, 0.711, 1.145, 1.635, 2.167, 2.733, 3.325, 3.940];

var drawPlot = (name, data, caption) => {
	var plot = document.getElementById('plot-' + name);
	var layout = {
		title: caption ? caption : 'Plot of ' +  name,
		margin: {
			t: 30,
			b: 20,
			l: 25
		}
	};
	Plotly.newPlot(plot, data, layout);
}

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

{	// Auto-corellation, trend, season, leftover
	var trendFunction = t => 5e-4 * Math.pow(t + 1, 2) - 0.1078 * (t + 1) + 28.112;
	var autoCovariance = (data, index) => {
		let sum = 0;
		for (let i = 0; i < data.length - index; i++) {
			sum += (data[i] - mathExpectation(data)) * (data[i + index] - mathExpectation(data));
		}
		return sum / (data.length - index);
	}
	var autoCorellation = (data, t) => autoCovariance(data, t) / autoCovariance(data, 0);

	{	// Season
		// Get correction of trend
		var seasonLine = DATA.map((val, t) => val - trendFunction(t));
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
		var seasonFunction = i => seasonLine[i % seasons];
	}

	var leftover = DATA.map((price, t) => price - trendFunction(t) - seasonFunction(t));
}

function statisticsBoxPierce(p, leftovers) {
	let r = (j, e) => {
		let N = e.length;
		let numerator = 0;
		let denomenator = 1;

		for (let t = j + 1; t < N; t++)
			numerator += e[t] * e[t - j];
		for (let t = 1; t < N; t++)
			denomenator += Math.pow(e[t], 2);

		return numerator / denomenator;
	};

	let sum = 0;
	for (let j = 0; j < p; j++) {
		let rRes = r(j, leftovers);

		sum += Math.pow(rRes, 2);
	}

	return N * sum;
}

particialAutoCorrelation1 = (e) => {
	let arr = [];
	for (let i = 1; i < e.length; i++) {
		let rPrevSquared = Math.pow(autoCorellation(e, i - 1), 2);
		arr[i - 1] = autoCorellation(e, i) - rPrevSquared;
		arr[i - 1] /= 1 - rPrevSquared;
	}
	return arr;
}

{	// AR(1) model, DF condition
	var teta = optimjs.minimize_Powell(v => leftover.reduce((acc, cur, t) => t ? acc + Math.pow(v[0] * leftover[t - 1] - cur, 2) : cur), [.8]).argument[0];;
	var newLeftover = leftover.map((item, t) => t ? leftover[t - 1] * teta : item);
	$('.teta').html(teta.toFixed(3));

	let statisticsStudent = leftover[0] / Math.sqrt(leftover.reduce((acc, cur) => acc + Math.pow(cur, 2)) / leftover.length);
	let stat = (teta - 1) / statisticsStudent;
	let crit = -2.58;

	var dfAccept = stat < crit;
	let str = `t = ${stat.toFixed(4)} ${dfAccept ? '<' : '>'} DF<sub>α</sub>(α, N) = ${crit}`;
	$('.df-condition').html(str);
	$('.df-accept').html(dfAccept ? 'принимается' : 'отвергается');
	$('.df-station').html(dfAccept ? 'стационарен' : 'не стационарен');
}

if (!dfAccept) {
	let k, accept = true, str = '<p>Далее необходимо перейти к поиску порядка интегрирования ряда остатков. Для этого воспользуемся критерием Бокса-Пирса для гипотезы об отсутствии автокорреляции до порядка <span class="math">p</span>.</p><p>Для проверки этой гипотезы используется статистика Бокса-Пирса, имеющая вид: <span class="math">Q = N * sum of (r<sup>2</sup>(j)) from j = 1 to p</span>. Гипотеза отвергается, если <span class="math">Q > χ<sup>2</sup><sub>кр</sub>(1 - α, p)</span>.</p>';
	for(k = 0; k < 5 && accept; k++) {
		let stat = statisticsBoxPierce(k, leftover);
		let crit = chiSquaredAt095[k];
	
		accept = stat < crit;
		let acceptText = accept ? 'принимается' : 'отвергается';
		str += `<p>Статистика Бокса-Пирса для <span class="math">k = ${k + 1}: ${stat.toFixed(4)}</span>. Критическое значение <span class="math">χ<sup>2</sup>(0.95, ${k + 1}) = ${crit}</span>.`;
		str += ` Гипотеза об отсутствии автокорреляции до порядка p = <span class="math">${k + 1} ${acceptText}</span>.</p>`;
	}
	str += `<p>Соответственно, порядок интегрирования <span class="math">k = ${k - 1}</span>.</p>`;
	$('.df-inspection').after(str);
}

console.log(leftover.reduce((acc, cur) => acc += `\n${cur}`));

{	// ARIMA building
	// 0.4166 0.2620,-0.0508
	var arima = [];
	for(let t = 0; t < leftover.length; t++) {
		arima[t] = t > 2 ?
		-0.0613 + 0.6825 * (leftover[t - 1] - leftover[t - 2]) + leftover[t - 1] :
		leftover[t];
	}
}

{	// AR(1) model, DF condition
	var arimaLeftover = arima.map((item, t) => leftover[t] - item);
	var teta = optimjs.minimize_Powell(v => arimaLeftover.reduce((acc, cur, t) => t ? acc + Math.pow(v[0] * arimaLeftover[t - 1] - cur, 2) : cur), [.8]).argument[0];
	var newArimaLeftover = arimaLeftover.map((item, t) => t ? arimaLeftover[t - 1] * teta : item);
	// $('.teta').html(teta.toFixed(3));

	let statisticsStudent = arimaLeftover[3] / 4 / Math.sqrt(arimaLeftover.reduce((acc, cur) => acc + Math.pow(cur, 2)) / arimaLeftover.length);
	console.log(arima[0], Math.sqrt(arimaLeftover.reduce((acc, cur) => acc + Math.pow(cur, 2)) / arimaLeftover.length))
	let stat = (teta - 1) / statisticsStudent;
	let crit = -2.58;

	var dfAccept = stat < crit;
	let str = `t = ${stat.toFixed(4)} ${dfAccept ? '<' : '>'} DF<sub>α</sub>(α, N) = ${crit}`;
	$('.arima-df-condition').html(str);
	$('.arima-df-accept').html(dfAccept ? 'принимается' : 'отвергается');
	$('.arima-df-station').html(dfAccept ? 'стационарен' : 'не стационарен');
}

drawPlot('leftover', [{x: DATA_X, y: leftover}], 'Ряд остатков');
drawPlot('ar_model', [{x: DATA_X, y: leftover, name: 'Остатки'}, {x: DATA_X, y: newLeftover, name: 'AR(1)'}], 'AR(1) модель');
drawPlot('arima', [{x: DATA_X, y: leftover, name: 'Остатки'}, {x: DATA_X, y: arima, name: 'ARIMA-модель'}], 'ARIMA-модель и ряд остатков');
drawPlot('arima_df', [{x: DATA_X, y: arimaLeftover, name: 'Остатки после ARIMA-модели'}, {x: DATA_X, y: newArimaLeftover, name: 'AR(1) остатков после ARIMA-модели'}], 'Ряд остатков после ARIMA-модели');
drawPlot('basic', [{x: DATA_X, y: DATA, name: 'Исходный ряд'}, {x: DATA_X, y: DATA.map((_, t) => trendFunction(t) + seasonFunction(t) + arima[t]), name: 'Итоговая модель'}, {x: DATA_X, y: DATA.map((_, t) => trendFunction(t) + seasonFunction(t)), name: 'Модель без ARIMA'}], 'Модель в терминах исходного ряда');