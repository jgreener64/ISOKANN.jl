var documenterSearchIndex = {"docs":
[{"location":"isomu/#IsoMu","page":"IsoMu","title":"IsoMu","text":"","category":"section"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"Analysing trajectory data from mu opiod receptor with ISOKANN and reaction path subsampling.","category":"page"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"contact: a sikorski, s chewle","category":"page"},{"location":"isomu/#Loading-the-julia-project","page":"IsoMu","title":"Loading the julia project","text":"","category":"section"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"run julia (install via: google juliaup)\nactivate the project julia> ]activate .\nupdate ISOKANN to their github master branches","category":"page"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"julia> ]add https://github.com/axsk/ISOKANN.jl","category":"page"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"load the module via julia> using ISOKANN, ISOKANN.IsoMu","category":"page"},{"location":"isomu/#Running-the-clustering","page":"IsoMu","title":"Running the clustering","text":"","category":"section"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"# create a DataLink to the trajectory's directory\nlink = DataLink(\"path/to/traj\")\n\n# create the ISOKANN environment\nmu = isokann(link)\n\n# train the network\ntrain!(mu)\n\n# save the reactive path\nsave_reactive_path(mu, sigma=0.1, out=\"out/path.pbd\", method=IsoMu.MaxPath())\n","category":"page"},{"location":"isomu/#Starting-on-SLURM-with-gpu","page":"IsoMu","title":"Starting on SLURM with gpu","text":"","category":"section"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"srun –gres=gpu –partition gpu –constraint \"A40-RTX-48GB\" –pty bash","category":"page"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"then ISOKANN.gpu!(mu::IsoRun)","category":"page"},{"location":"isomu/#A-more-advanced-example","page":"IsoMu","title":"A more advanced example","text":"","category":"section"},{"location":"isomu/","page":"IsoMu","title":"IsoMu","text":"using IsoMu, Flux\n\n# read the trajectory from the 10th frame, every 10 frames with distance cutoff 10 and reverse the trajectory\ndata = DataLink(\"data/8EF5_500ns_pka_7.4_no_capping_310.10C/\", startpos=10, stride=10, radius=10, reverse=true)\n\n# specify the network and training parameters\nmu = isokann(data, networkargs=(;layers=4, activation=Flux.leakyrelu), learnrate = 1e-3, regularization=1e-4, minibatch=256,)\n\ngpu!(mu)  # transfer model to gpu\ntrain!(mu, 10000)  # 10000 iterations\nadjust!(mu, 1e-4, lambda=1e-3) # set learnrate to 1e-4 and decay to 1e-3\ntrain!(mu, 10000)  # 10000 iterations","category":"page"},{"location":"introduction/#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"This package provides the core ISOKANN algorithm as well as some wrappers and convenience routines to work with different kind of simulations and data.","category":"page"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"The core ISOKANN algorithm is accessed by the Iso2 type, which holds the neural network, optimizer, ISOKANN parameters and training data.","category":"page"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"You can construct it by passing a tuple of (xs, ys) of arrays as input data. Here xs is a matrix where the columns are starting points of trajectories and ys is a 3 dimensional array where ys[d,k,n] is the d-th coordinate of the k-th Koopman-replica of the n-th trajectory.","category":"page"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"To start training the neural network simply call the run! function passing the Iso2 object and the number of ISOKANN iterations. The resulting \\chi values can be obtained via the chis method","category":"page"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"iso=Iso2((rand(3,100), rand(3,10,100)))\nrun!(iso)\nchis(iso)","category":"page"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"We also supply some basic simulations which can generate the data, e.g. Doublewell, MuellerBrown, Diffusion, MollySimulation and OpenMMSimulation. You can use the isodata function to sample data for ISOKANN.","category":"page"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"sim = Doublewell()\ndata = isodata(sim, 100, 20)\niso = Iso2(data)","category":"page"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"We also provide different type of wrappers to load simulations [vgv] or generate data from trajectories [IsoMu].","category":"page"},{"location":"introduction/","page":"Introduction","title":"Introduction","text":"For an advanced example take a look at the scripts/vgvadapt.jl file.","category":"page"},{"location":"installation/#Installation","page":"Installation","title":"Installation","text":"","category":"section"},{"location":"installation/","page":"Installation","title":"Installation","text":"Install Julia (>=v1.10) using https://github.com/JuliaLang/juliaup","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"curl -fsSL https://install.julialang.org | sh","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"After restarting your shell you should be able to start the Julia REPL via the command julia.","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"In the REPL you can add ISOKANN.jl to your project by entering the package mode (type ]) and typing","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"pkg> add https://github.com/axsk/ISOKANN.jl\npkg> test ISOKANN","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"Note that this can take a while on the first run as Julia downloads and precompiles all dependencies.","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"We plan on installing OpenMM automatically with ISOKANN. Right now, if you want to use openmm with ISOKANN you will need to make it available to PyCall.jl. This should work automatically, when using the Conda.jl Conda environment (i.e. starting julia with the env PYTHON=\"\" and running pkg> build PyCall.). See also the PyCall docs.","category":"page"},{"location":"installation/#Development","page":"Installation","title":"Development","text":"","category":"section"},{"location":"installation/","page":"Installation","title":"Installation","text":"If you want to make changes to ISOKANN you should clone it into a directory","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"git clone git@github.com:axsk/ISOKANN.jl.git","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"Then start Julia in that directory, activate it with ]activate ., instantiate the dependencies with ]instantiate.","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"You should then be able to run the tests with ]test or start using ISOKANN.","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"We strongly recommend using Revise before ISOKANN, so that your changes will automatically load in your current session.","category":"page"},{"location":"#ISOKANN.jl","page":"ISOKANN.jl","title":"ISOKANN.jl","text":"","category":"section"},{"location":"","page":"ISOKANN.jl","title":"ISOKANN.jl","text":"Documentation for ISOKANN.jl","category":"page"},{"location":"","page":"ISOKANN.jl","title":"ISOKANN.jl","text":"CurrentModule = ISOKANN","category":"page"},{"location":"#Main-entry-points","page":"ISOKANN.jl","title":"Main entry points","text":"","category":"section"},{"location":"","page":"ISOKANN.jl","title":"ISOKANN.jl","text":"IsoRun\nISOKANN.run!\nMollyLangevin\npropagate","category":"page"},{"location":"#ISOKANN.run!","page":"ISOKANN.jl","title":"ISOKANN.run!","text":"run!(iso::Iso2, n=1, epochs=1)\n\nRun the training process for the Iso2 model.\n\nArguments\n\niso::Iso2: The Iso2 model to train.\nn::Int: The number of (outer) Koopman iterations.\nepochs::Int: The number of (inner) epochs to train the model for each Koopman evaluation.\n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.propagate","page":"ISOKANN.jl","title":"ISOKANN.propagate","text":"propagate(s::OpenMMSimulation, x0::AbstractMatrix{T}, ny; nthreads=Threads.nthreads(), mmthreads=1) where {T}\n\nPropagates ny replicas of the OpenMMSimulation s from the inintial states x0.\n\nArguments\n\ns: An instance of the OpenMMSimulation type.\nx0: Matrix containing the initial states as columns\nny: The number of replicas to create.\n\nOptional Arguments\n\nnthreads: The number of threads to use for parallelization of multiple simulations.\nmmthreads: The number of threads to use for each OpenMM simulation. Set to \"gpu\" to use the GPU platform.\n\n\n\n\n\n","category":"function"},{"location":"#Public-API","page":"ISOKANN.jl","title":"Public API","text":"","category":"section"},{"location":"","page":"ISOKANN.jl","title":"ISOKANN.jl","text":"Modules = [ISOKANN, ISOKANN.OpenMM]\nPrivate = false","category":"page"},{"location":"#ISOKANN.Iso2-Tuple{Any}","page":"ISOKANN.jl","title":"ISOKANN.Iso2","text":"Iso2(data; opt=AdamRegularized(), model=pairnet(data), gpu=false, kwargs...)\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.Iso2-Tuple{ISOKANN.IsoSimulation}","page":"ISOKANN.jl","title":"ISOKANN.Iso2","text":"Iso2(sim::IsoSimulation; nx=100, nk=10, nd=1, kwargs...)\n\nConvenience constructor which generates the SimulationData from the simulation sim and constructs the Iso2 object. See also Iso2(data; kwargs...)\n\nArguments\n\nsim::IsoSimulation: The IsoSimulation object.\nnx::Int: The number of starting points.\nnk::Int: The number of koopman samples.\nnd::Int: Dimension of the χ function.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.SimulationData","page":"ISOKANN.jl","title":"ISOKANN.SimulationData","text":"struct SimulationData{S,D,C,F}\n\nA struct combining a simulation with the simulated coordinates and corresponding ISOKANN trainingsdata\n\nFields\n\nsim::S: The simulation object.\ndata::D: The ISOKANN trainings data.\ncoords::C: The orginal coordinates of the simulations.\nfeaturizer::F: A function mapping coordinates to ISOKANN features.\n\n\n\n\n\n","category":"type"},{"location":"#ISOKANN.SimulationData-Tuple{ISOKANN.IsoSimulation}","page":"ISOKANN.jl","title":"ISOKANN.SimulationData","text":"SimulationData(sim::IsoSimulation, nx::Int, nk::Int, featurizer=featurizer(sim))\n\nGenerates ISOKANN trainingsdata with nx initial points and nk Koopman samples each.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.AdamRegularized","page":"ISOKANN.jl","title":"ISOKANN.AdamRegularized","text":"Adam with L2 regularization. Note that this is different from AdamW (Adam+WeightDecay) (c.f. Decay vs L2 Reg.) \n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.pairnet","page":"ISOKANN.jl","title":"ISOKANN.pairnet","text":"Fully connected neural network with layers layers from n to nout dimensions. features allows to pass a featurizer as preprocessor,  activation determines the activation function for each but the last layer lastactivation can be used to modify the last layers activation function \n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.reactionpath_minimum","page":"ISOKANN.jl","title":"ISOKANN.reactionpath_minimum","text":"reactionpath_minimum(iso::Iso2, x0; steps=100)\n\nCompute the reaction path by integrating ∇χ with orthogonal energy minimization.\n\nArguments\n\niso::Iso2: The isomer for which the reaction path minimum is to be computed.\nx0: The starting point for the reaction path computation.\nsteps=100: The number of steps to take along the reaction path.\n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.reactionpath_ode-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.reactionpath_ode","text":"reactionpath_ode(iso, x0; steps=101, extrapolate=0, orth=0.01, solver=OrdinaryDiffEq.Tsit5(), dt=1e-3, kwargs...)\n\nCompute the reaction path by integrating ∇χ as well as orth * F orthogonal to ∇χ where F is the original force field.\n\nArguments\n\niso::Iso2: The isomer for which the reaction path minimum is to be computed.\nx0: The starting point for the reaction path computation.\nsteps=100: The number of steps to take along the reaction path.\nminimize=false: Whether to minimize the orthogonal to ∇χ before integration.\nextrapolate=0: How fast to extrapolate beyond χ 0 and 1.\north=0.01: The weight of the orthogonal force field.\nsolver=OrdinaryDiffEq.Tsit5(): The solver to use for the ODE integration.\ndt=1e-3: The initial time step for the ODE integration.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.run!-2","page":"ISOKANN.jl","title":"ISOKANN.run!","text":"run!(iso::Iso2, n=1, epochs=1)\n\nRun the training process for the Iso2 model.\n\nArguments\n\niso::Iso2: The Iso2 model to train.\nn::Int: The number of (outer) Koopman iterations.\nepochs::Int: The number of (inner) epochs to train the model for each Koopman evaluation.\n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.runadaptive!-Tuple{Any}","page":"ISOKANN.jl","title":"ISOKANN.runadaptive!","text":"runadaptive!(iso; generations=1, nx=10, iter=100, cutoff=Inf)\n\nTrain iso with adaptive sampling. Sample nx new data points followed by iter isokann iterations and repeat this generations times. cutoff specifies the maximal data size, after which new data overwrites the oldest data.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.save_reactive_path","page":"ISOKANN.jl","title":"ISOKANN.save_reactive_path","text":"save_reactive_path(iso::Iso2, coords::AbstractMatrix;\n    sigma=1,\n    out=\"out/reactive_path.pdb\",\n    source,\n    kwargs...)\n\nExtract and save the reactive path of a given iso.\n\nComputes the maximum likelihood path with parameter sigma along the given data points,  aligns it and saves it to the out path.\n\nArguments\n\niso::Iso2: The isomer for which the reactive path is computed.\ncoords::AbstractMatrix: The coordinates corresponding to the samples in iso\nsigma=1: The standard deviation used for the reactive path calculation.\nout=\"out/reactive_path.pdb\": The output file path for saving the reactive path.\nsource: The source .pdb file\n\n= kwargs...: additional parameters passed to reactive_path.\n\nReturns\n\nids: The IDs of the reactive path.\n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.OpenMM.OpenMMSimulation","page":"ISOKANN.jl","title":"ISOKANN.OpenMM.OpenMMSimulation","text":"A Simulation wrapping the Python OpenMM Simulation object \n\n\n\n\n\n","category":"type"},{"location":"#ISOKANN.OpenMM.OpenMMSimulation-Tuple{}","page":"ISOKANN.jl","title":"ISOKANN.OpenMM.OpenMMSimulation","text":"OpenMMSimulation(; pdb=DEFAULT_PDB, forcefields=[\"amber14-all.xml\", \"amber14/tip3pfb.xml\"], temp=298, friction=1, step=0.002, steps=100, features=nothing, minimize=false)\n\nConstructs an OpenMM simulation object.\n\nArguments\n\npdb::String: Path to the PDB file.\nforcefields::Vector{String}: List of force field XML files.\ntemp::Float64: Temperature in Kelvin.\nfriction::Float64: Friction coefficient in 1/picosecond.\nstep::Float64: Integration step size in picoseconds.\nsteps::Int: Number of simulation steps.\nfeatures: Which features to use for learning the chi function.             -  A vector of Int denotes the indices of all atoms to compute the pairwise distances from.             -  A vector of CartesianIndex{2} computes the specific distances between the atom pairs.             -  A number denotes the radius below which all pairs of atoms will be used (computed only on the starting configuration)             -  If nothing all pairwise distances are used.\nminimize::Bool: Whether to perform energy minimization on first state.\n\nReturns\n\nOpenMMSimulation: An OpenMMSimulation object.\n\n\n\n\n\n","category":"method"},{"location":"#Internal-API","page":"ISOKANN.jl","title":"Internal API","text":"","category":"section"},{"location":"","page":"ISOKANN.jl","title":"ISOKANN.jl","text":"Modules = [ISOKANN, ISOKANN.OpenMM]\nPublic = false","category":"page"},{"location":"#ISOKANN.DataTuple","page":"ISOKANN.jl","title":"ISOKANN.DataTuple","text":"DataTuple = Tuple{Matrix{T},Array{T,3}} where {T<:Number}\n\nWe represent data as a tuple of xs and ys.\n\nxs is a matrix of size (d, n) where d is the dimension of the system and n the number of samples. ys is a tensor of size (d, k, n) where k is the number of koopman samples.\n\n\n\n\n\n","category":"type"},{"location":"#ISOKANN.IsoSimulation","page":"ISOKANN.jl","title":"ISOKANN.IsoSimulation","text":"abstract type IsoSimulation\n\nAbstract type representing an IsoSimulation. Should implement the methods getcoords, propagate, dim\n\n\n\n\n\n","category":"type"},{"location":"#ISOKANN.Stabilize2","page":"ISOKANN.jl","title":"ISOKANN.Stabilize2","text":"TransformStabilize(transform, last=nothing)\n\nWraps another transform and permutes its target to match the previous target\n\nCurrently we also have the stablilization (wrt to the model though) inside each Transform. TODO: Decide which to keep\n\n\n\n\n\n","category":"type"},{"location":"#ISOKANN.TransformISA","page":"ISOKANN.jl","title":"ISOKANN.TransformISA","text":"TransformISA(permute)\n\nCompute the target via the inner simplex algorithm (without feasiblization routine). permute specifies whether to apply the stabilizing permutation \n\n\n\n\n\n","category":"type"},{"location":"#ISOKANN.TransformPseudoInv","page":"ISOKANN.jl","title":"ISOKANN.TransformPseudoInv","text":"TransformPseudoInv(normalize, direct, eigenvecs, permute)\n\nCompute the target by approximately inverting the action of K with the Moore-Penrose pseudoinverse.\n\nIf direct==true solve chi * pinv(K(chi)), otherwise inv(K(chi) * pinv(chi))). eigenvecs specifies whether to use the eigenvectors of the schur matrix. normalize specifies whether to renormalize the resulting target vectors. permute specifies whether to permute the target for stability.\n\n\n\n\n\n","category":"type"},{"location":"#ISOKANN.TransformShiftscale","page":"ISOKANN.jl","title":"ISOKANN.TransformShiftscale","text":"TransformShiftscale()\n\nClassical 1D shift-scale (ISOKANN 1) \n\n\n\n\n\n","category":"type"},{"location":"#ISOKANN._pickclosestloop-Tuple{AbstractVector, AbstractVector}","page":"ISOKANN.jl","title":"ISOKANN._pickclosestloop","text":"scales with n=length(hs) \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.adddata-NTuple{4, Any}","page":"ISOKANN.jl","title":"ISOKANN.adddata","text":"adddata(data::D, model, sim, ny, lastn=1_000_000)::D\n\nGenerate new data for ISOKANN by adaptive subsampling using the chi-stratified/-uniform method.\n\nAdaptively subsample ny points from data uniformly along their model values.\npropagate according to the simulation model.\nreturn the newly obtained data concatenated to the input data\n\nThe subsamples are taken only from the lastn last datapoints in data.\n\nExamples\n\njulia> (xs, ys) = adddata((xs,ys), chi, mollysim)\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.adddata-Tuple{SimulationData, Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.adddata","text":"adddata(d::SimulationData, model, n)\n\nχ-stratified subsampling. Select n samples amongst the provided ys/koopman points of d such that their χ-value according to model is approximately uniformly distributed and propagate them. Returns a new SimulationData which has the new data appended.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.bootstrap-Tuple{ISOKANN.IsoSimulation, Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.bootstrap","text":"bootstrap(sim, nx, ny) :: DataTuple\n\ncompute initial data by propagating the molecules initial state to obtain the xs and propagating them further for the ys \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.centercoords-Tuple{Any}","page":"ISOKANN.jl","title":"ISOKANN.centercoords","text":"centercoords any given states by shifting their individual 3d mean to the origin\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.chi_exit_rate-Tuple{Any, Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.chi_exit_rate","text":"compute the chi exit rate as per Ernst, Weber (2017), chap. 3.3 \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.data_from_trajectory-Tuple{AbstractMatrix}","page":"ISOKANN.jl","title":"ISOKANN.data_from_trajectory","text":"data_from_trajectory(xs::Matrix; reverse=false) :: DataTuple\n\nGenerate the lag-1 data from the trajectory xs. If reverse is true, also take the time-reversed lag-1 data.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.exportdata","page":"ISOKANN.jl","title":"ISOKANN.exportdata","text":"exportdata(data::AbstractArray, model, sys, path=\"out/data.pdb\")\n\nExport data to a PDB file.\n\nThis function takes an AbstractArray data, sorts it according to the model evaluation, removes duplicates, transforms it to standard form and saves it as a PDB file  to path.\n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.fixperm-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.fixperm","text":"fixperm(new, old)\n\nPermutes the rows of new such as to minimize L1 distance to old.\n\nArguments\n\nnew: The data to match to the reference data.\nold: The reference data.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.flatpairdists-Tuple{Any}","page":"ISOKANN.jl","title":"ISOKANN.flatpairdists","text":"flatpairdists(x)\n\nAssumes each col of x to be a flattened representation of multiple 3d coords. Returns the flattened pairwise distances as columns.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.flattenfirst-Tuple{Any}","page":"ISOKANN.jl","title":"ISOKANN.flattenfirst","text":"collapse the first and second dimension of the array A into the first dimension \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.growmodel-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.growmodel","text":"Given a model and return a copy with its last layer replaced with given output dimension n \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.inputdim-Tuple{Flux.Chain}","page":"ISOKANN.jl","title":"ISOKANN.inputdim","text":"obtain the input dimension of a Flux model \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.kabsch-Tuple{AbstractMatrix, AbstractMatrix}","page":"ISOKANN.jl","title":"ISOKANN.kabsch","text":"compute R such that R*p is closest to q\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.koopman-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.koopman","text":"evluation of koopman by shiftscale(mean(model(data))) on the data \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.localpdistinds-Tuple{AbstractMatrix, Any}","page":"ISOKANN.jl","title":"ISOKANN.localpdistinds","text":"localpdistinds(coords::AbstractMatrix, radius)\n\nGiven coords of shape ( 3n x frames ) return the pairs of indices whose minimal distance along all frames is at least once lower then radius\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.model_with_opt","page":"ISOKANN.jl","title":"ISOKANN.model_with_opt","text":"convenience wrapper returning the provided model with the default AdamW optimiser \n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.outputdim-Tuple{Flux.Chain}","page":"ISOKANN.jl","title":"ISOKANN.outputdim","text":"Obtain the output dimension of a Flux model \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.pairdistfeatures-Tuple{AbstractVector}","page":"ISOKANN.jl","title":"ISOKANN.pairdistfeatures","text":"pairdistfeatures(inds::AbstractVector)\n\nReturns a featurizer function which computes the pairwise distances between the particles specified by inds\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.pdists-Tuple{AbstractMatrix, Any}","page":"ISOKANN.jl","title":"ISOKANN.pdists","text":"pdists(traj::Array{<:Any, 3}, inds)\n\nCompute the pairwise distances between the particles specified by the tuples inds over all frames in traj.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.pickclosest_sort-Tuple{AbstractVector, AbstractVector}","page":"ISOKANN.jl","title":"ISOKANN.pickclosest_sort","text":"pickclosest(haystack, needles)\n\nReturn the indices into haystack which lie closest to needles without duplicates by removing haystack candidates after a match. Note that this is not invariant under pertubations of needles\n\nscales with n log(n) m where n=length(haystack), m=length(needles) \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.plotatoms!","page":"ISOKANN.jl","title":"ISOKANN.plotatoms!","text":"scatter plot of all first \"O\" atoms of the starting points xs as well as the \"O\" atoms from the koopman samples to the first point from ys\n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.plotlossdata","page":"ISOKANN.jl","title":"ISOKANN.plotlossdata","text":"combined plot of loss graph and current atoms \n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.reactionforce","page":"ISOKANN.jl","title":"ISOKANN.reactionforce","text":"reactionforce(iso, sim, x, direction, orth=1)\n\nCompute the vector f with colinear component to dchi/dx such that dchi/dx * f = 1 and orth*forcefield in the orthogonal space\n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.savecoords","page":"ISOKANN.jl","title":"ISOKANN.savecoords","text":"savecoords(path::String, iso::Iso2, inds=1:numobs(iso.data))\n\nSave the coordinates of the specified observation indices from the data of of iso to the file path.\n\nsavecoords(path::String, iso::Iso2, coords::AbstractArray)\n\nSave the coordinates of the specified matrix of coordinates to a file, using the molecule in iso as a template.\n\n\n\n\n\n","category":"function"},{"location":"#ISOKANN.saveextrema-Tuple{String, Iso2}","page":"ISOKANN.jl","title":"ISOKANN.saveextrema","text":"saveextrema(path::String, iso::Iso2)\n\nSave the two extermal configurations (metastabilities) to the file path.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.scatter_chifix-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.scatter_chifix","text":"fixed point plot, i.e. x vs model(x) \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.selectrows-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.selectrows","text":"given an array of arbitrary shape, select the rows inds in the first dimension \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.shiftscale-Tuple{Any}","page":"ISOKANN.jl","title":"ISOKANN.shiftscale","text":"empirical shift-scale operation \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.simulationtime-Tuple{Iso2}","page":"ISOKANN.jl","title":"ISOKANN.simulationtime","text":"simulationtime(iso::Iso2)\n\nprint and return the total simulation time contained in the data of iso in nanoseconds.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.sqpairdist-Tuple{AbstractArray{<:Any, 3}}","page":"ISOKANN.jl","title":"ISOKANN.sqpairdist","text":"simplepairdists(x::AbstractArray{<:Any,3})\n\nCompute the pairwise distances between the columns of x, batched along the 3rd dimension.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.subsample-Tuple{Any, AbstractMatrix, Any}","page":"ISOKANN.jl","title":"ISOKANN.subsample","text":"subsample(model, data::Array, n) :: Matrix\nsubsample(model, data::Tuple, n) :: Tuple\n\nSubsample n points of data uniformly in model. If model returns multiple values per sample, subsample along each dimension.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.subsample-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.subsample","text":"subsample(data, nx)\n\nreturn a random subsample of nx points from data \n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.subsample_inds-Tuple{Any, Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.subsample_inds","text":"subsample_inds(model, xs, n) :: Vector{Int}\n\nReturns n indices of xs such that model(xs[inds]) is approximately uniformly distributed.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.subsample_uniformgrid-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.subsample_uniformgrid","text":"subsbample_uniformgrid(ys, n) -> is\n\ngiven a list of values ys, return nindicesissuch thatys[is]` are approximately uniform by picking the closest points to a randomly perturbed grid in [0,1].\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.trajectory-Tuple{Any, Any}","page":"ISOKANN.jl","title":"ISOKANN.trajectory","text":"trajectory(sim, nx) generate a trajectory of length nx from the simulation sim\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.propagate-Union{Tuple{T}, Tuple{OpenMMSimulation, AbstractMatrix{T}, Any}} where T","page":"ISOKANN.jl","title":"ISOKANN.propagate","text":"propagate(s::OpenMMSimulation, x0::AbstractMatrix{T}, ny; nthreads=Threads.nthreads(), mmthreads=1) where {T}\n\nPropagates ny replicas of the OpenMMSimulation s from the inintial states x0.\n\nArguments\n\ns: An instance of the OpenMMSimulation type.\nx0: Matrix containing the initial states as columns\nny: The number of replicas to create.\n\nOptional Arguments\n\nnthreads: The number of threads to use for parallelization of multiple simulations.\nmmthreads: The number of threads to use for each OpenMM simulation. Set to \"gpu\" to use the GPU platform.\n\n\n\n\n\n","category":"method"},{"location":"#ISOKANN.randx0-Tuple{OpenMMSimulation, Any}","page":"ISOKANN.jl","title":"ISOKANN.randx0","text":"generate n random inintial points for the simulation mm \n\n\n\n\n\n","category":"method"}]
}
