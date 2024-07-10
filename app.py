from flask import Flask, request, jsonify, render_template
import networkx as nx
import csv
import io

app = Flask(__name__)
graph = nx.DiGraph()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_relationship', methods=['POST'])
def add_relationship():
    try:
        data = request.get_json()
        entity1 = data['entity1']
        relationship = data['relationship']
        entity2 = data['entity2']
        if not entity1 or not relationship or not entity2:
            return jsonify(success=False, error="All fields are required"), 400
        graph.add_edge(entity1, entity2, label=relationship)
        return jsonify(success=True, graph=nx_to_dict(graph))
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    try:
        file = request.files['file']
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.reader(stream)
        for row in csv_input:
            entity1, relationship, entity2 = row
            graph.add_edge(entity1, entity2, label=relationship)
        return jsonify(success=True, graph=nx_to_dict(graph))
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

@app.route('/delete_graph', methods=['POST'])
def delete_graph():
    try:
        graph.clear()
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

@app.route('/add_multiple_relationships', methods=['POST'])
def add_multiple_relationships():
    try:
        data = request.get_json()
        relationships = data.get('relationships', [])
        for rel in relationships:
            entity1 = rel['entity1']
            relationship = rel['relationship']
            entity2 = rel['entity2']
            graph.add_edge(entity1, entity2, label=relationship)
        return jsonify(success=True, graph=nx_to_dict(graph))
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

@app.route('/query_node/<node>', methods=['GET'])
def query_node(node):
    try:
        if node in graph:
            neighbors = {neighbor: graph.edges[node, neighbor]['label'] for neighbor in graph.neighbors(node)}
            return jsonify(success=True, node=node, relationships=neighbors)
        else:
            return jsonify(success=False, error=f"Node {node} not found"), 404
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

@app.route('/load_graph', methods=['GET'])
def load_graph():
    try:
        return jsonify(success=True, graph=nx_to_dict(graph))
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

def nx_to_dict(graph):
    graph_dict = {}
    for node in graph.nodes:
        graph_dict[node] = {neighbor: graph.edges[node, neighbor]['label'] for neighbor in graph.neighbors(node)}
    return graph_dict

if __name__ == '__main__':
    app.run(debug=True)
