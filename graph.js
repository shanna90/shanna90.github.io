var disp;
var n;
function Equ(){
	document.getElementById("equation").style.display = "inline";
	document.getElementById("matrix").style.display = "none";
	disp = 'e';
	document.getElementById("equ_entry").style.display = "none";
	document.getElementById("mat_entry").style.display = "none";
	document.getElementById("R").style.display = "block";
}

function Mat(){
	document.getElementById("equation").style.display = "none";
	document.getElementById("matrix").style.display = "inline";
	disp = 'm';
	document.getElementById("equ_entry").style.display="none";
	document.getElementById("mat_entry").style.display="none";
	document.getElementById("R").style.display = "block";
	generate_table()
}
function generate_table(){
	n = document.getElementById("num_nodes").value;
	f = document.getElementById("matrix");
	f.innerHTML = "Adjacency Matrix, supporting edge length <br>"
	t = document.createElement("table");
	f.appendChild(t);
	lables = document.createElement("tr")
	lable1=document.createElement('th')
	lable1.innerHTML = "node lable"
	lables.appendChild(lable1)
	t.appendChild(lables)
	for (var i = 0; i<n; i++){
		r = document.createElement("tr");
		for (var j=0; j-1<n; j++){
			node = document.createElement("td");
			txt = document.createElement("input");
			txt.type = "text";
			if(j==0){
				txt.id = "lable" + i.toString();
			}
			else{
				txt.id = i.toString() +"_" + (j-1).toString();
			}
			if( i==(j-1) ){
				txt.value = "x";
			}
			if(document.getElementById("undirected").checked && j<i){
				txt.value = "x";
			}
			node.appendChild(txt);
			r.appendChild(node);
		}
		f.appendChild(r);
	}
}
function Adj(node, list){
	this.n = node;
	this.l = list;
}

var node_arr= new Array();
var adj_arr = new Array();


function Render(){
	document.getElementById("analysis_buttons").style = "display:block";
	document.getElementById("R").style = "display:none";
	var DOTstring;	
	document.getElementById("disp").innerHTML = disp;
	console.log("disp: " + disp);
	if (disp == 'e'){
		DOTstring= parseUserInfoE();
		parseUserInfoE_H();
	}
	if (disp=='m'){
		DOTstring = parseUserInfoM();
		parseUserInfoM_H();
	}
	console.log("DOT: " + DOTstring);
	var parsedData = vis.network.convertDot(DOTstring);
	console.log(parsedData);
	var data = {
	  nodes: parsedData.nodes,
	  edges: parsedData.edges
	}

	var options = parsedData.options;

	if(document.getElementById("undirected").checked == false)
	{
		options.edges = {
			arrows:'to'
		}			
	}
	
	// create a network
	var network = new vis.Network(mynetwork, data, options);
	
	//display analysis options
	document.getElementById("analysis_buttons").style = "display:block";
}
function parseUserInfoE(){
	//Get info from user
	var num_nodes = document.getElementById('num_nodes').value;
	var num_def = document.getElementById('node_def').value;
	var edge_def = document.getElementById('edge_def').value;
	var DOTString = 'graph{';
	var nodes = new String();
	var edges = new String();
	//Parse node info
	for(var i=0; i<num_nodes; i++){
		var equ = num_def.replace("n", i);
		var result = eval(equ);
		node_arr.push(result);
	}
	//Parse Edge info and create DotString
	for(var i=0; i<node_arr.length; i++){
		var adj = new Adj(node_arr[i], new Array());
		adj_arr.push(adj);
		//console.log(adj_arr);
		nodes=nodes.concat(node_arr[i]);
		nodes=nodes.concat(";");
		for(var j=0; j<node_arr.length; j++){
			var split = new Array();
			split = edge_def.split("=");
			var res0 = math.eval(split[0].replace("a", node_arr[i].toString()));
			var res1 = math.eval(split[1].replace("b", node_arr[j].toString()));
			//console.log(res0, res1);
			if (res0 == res1){
				//adj_arr[i].setNewAdj(j);
				edges=edges.concat(node_arr[i]);
				edges=edges.concat("--");
				edges=edges.concat(node_arr[j]);
				edges=edges.concat(";");
			}
		}
	}
	DOTString=DOTString.concat(nodes);
	DOTString=DOTString.concat(edges);
	DOTString=DOTString.concat("}");
	console.log(DOTString);
	document.getElementById("mynetwork").innerHTML = '<p>' + DOTString + '</p>';
	document.getElementById("DOT").innerHTML=DOTString;
	return DOTString;
}
function parseUserInfoM()
{
	var DOTString = 'graph{';
	var nodes = new String();
	var edges = new String();
	//create node array
	for(var i=0; i<n; i++){
		var str_id = "lable"+i.toString();
		console.log(str_id);
		node_arr.push(document.getElementById(str_id).value);
	}
	//list adjacencies for each node
	for(var i=0; i<node_arr.length; i++){
		var adj = new Adj(node_arr[i], new Array());
		adj_arr.push(adj);
		nodes=nodes.concat(node_arr[i]);
		nodes=nodes.concat(";");
		for(var j=0; j<node_arr.length; j++){
			var str_id = i.toString() +"_" + j.toString();
			if(document.getElementById(str_id).value != ('x')){
				if(document.getElementById(str_id).value != ('0')){
					edges=edges.concat(node_arr[i]);
					edges=edges.concat("--");
					edges=edges.concat(node_arr[j]);
					edges=edges.concat(";");
				}
			}			
	}}
	DOTString=DOTString.concat(nodes);
	DOTString=DOTString.concat(edges);
	DOTString=DOTString.concat("}");
	console.log(DOTString);
	document.getElementById("DOT").innerHTML = DOTString;
	document.getElementById("mynetwork").innerHTML = '<p>' + DOTString + '</p>';
	return DOTString;
}
//Get info from matrix for Hamiltonian
function parseUserInfoM_H(){
	var f = new String();
	//list adjacencies for each node
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			var str_id = i.toString() +"_" + j.toString();
			var val = document.getElementById(str_id).value;
			if (val == 'x')
				val = 0;
			f=f.concat(val);
			if(j<n-1){f=f.concat(",");}
		}
		f=f.concat('\n');
	}
	console.log(f)
	//send to html for python retreival
	document.getElementById("Ham").innerHTML = f;
}
//Get info from equation for Hamiltonian
function parseUserInfoE_H(){
	//Get info from user
	var num_nodes = document.getElementById('num_nodes').value;
	var num_def = document.getElementById('node_def').value;
	var edge_def = document.getElementById('edge_def').value;
	var f = new String();
	//Parse Edge info and create f
	for(var i=0; i<node_arr.length; i++){
		for(var j=0; j<node_arr.length; j++){
			var split = new Array();
			split = edge_def.split("=");
			var res0 = math.eval(split[0].replace("a", node_arr[i].toString()));
			var res1 = math.eval(split[1].replace("b", node_arr[j].toString()));
			if (res0 == res1){
				f=f.concat('1');
				if(j<num_nodes-1){f=f.concat(",");}
			}
			if (!document.getElementById("undirected").checked==false && res1==res0){
				f=f.concat('1');
				if(j<num_nodes-1){f=f.concat(",");}
			}
			else {
				f=f.concat('0');
				if(j<num_nodes-1){f=f.concat(",");}
			}
		}
		f=f.concat('\n');
	}
	console.log(f)
	//send to html for python retreival
	document.getElementById("Ham").innerHTML = f;
}
//Render a vertex colored graph
function VColor(){
	var DOTstring = document.getElementById("DOT").innerHTML;
	var parsedData = vis.network.convertDot(DOTstring);
	var data = {
	  nodes: parsedData.nodes,
	  edges: parsedData.edges
	}
	//get color cod from vcolor(vertex coloring)
	codes = document.getElementById("vcolor").innerHTML.split(',');
	var colors = [];
	//generate colors from codes
	for (var i = 0; i<codes.length; i++){
		var red=Math.floor(((codes[i]+1)*255*1.61803399)%255);
		var red_string = red.toString(16);
		var green=Math.floor((((codes[i]+1)*255*1.61803399)*2)%255);
		var green_string = green.toString(16);
		var blue=Math.floor((((codes[i]+1)*255*1.61803399)*3)%255);
		var blue_string=blue.toString(16);
		colors[i]="#"+red_string+green_string+blue_string;
	}
	//assign colors to nodes
	for	(var i=0; i<data.nodes.length; i++){
		data.nodes[i].color= colors[i];
	}
	var options = parsedData.options;

	options.edges={
		color:{color:'black'}
	}
	if(document.getElementById("undirected").checked == false)
	{
		options.edges = {
			arrows:'to'
		}			
	}
	// create a network
	var network = new vis.Network(vcolor, data, options);
	console.log(network);
	//remove color render button
	document.getElementById("render_color").style="display:none";
}
//Render an edge colored graph
function EColor(){
	var DOTstring = document.getElementById("DOT").innerHTML;
	var parsedData = vis.network.convertDot(DOTstring);
	var data = {
	  nodes: parsedData.nodes,
	  edges: parsedData.edges
	}
	//get color cod from vcolor(vertex coloring)
	codes = document.getElementById("ecolor").innerHTML.split(',');
	var colors = [];
	//generate colors from codes
	for (var i = 0; i<codes.length; i++){
		var red=Math.floor(((codes[i]+1)*255*1.61803399)%255);
		var red_string = red.toString(16);
		var green=Math.floor((((codes[i]+1)*255*1.61803399)*2)%255);
		var green_string = green.toString(16);
		var blue=Math.floor((((codes[i]+1)*255*1.61803399)*3)%255);
		var blue_string=blue.toString(16);
		colors[i]="#"+red_string+green_string+blue_string;
	}
	//assign colors to nodes
	for	(var i=0; i<data.edges.length; i++){
		data.edges[i].color= {color:colors[i]};
	}
	var options = parsedData.options;

	if(document.getElementById("undirected").checked == false)
	{
		options.edges = {
			arrows:'to'
		}			
	}
	console.log(data)
	// create a network
	var network = new vis.Network(ecolor, data, options);
	//remove color render button
	document.getElementById("render_ecolor").style="display:none";
}