## Interface to the Molly.System


dim(sys::System) = length(sys.atoms) * 3
defaultmodel(sys::System) = pairnet(sys::System)

" Return the rotation handle indices for the standardform of a molecule"
function rotationhandles(sys::Molly.System)
    # TODO: fix this ugly if-elseif recognition
    if dim(sys) == 22 # PDB_ACEMD
        return (2, 11, 19)
    elseif dim(sys) == 1234 # some other poweriteration
        return (1, 2, 3)
    else
        error("No rotation handles known for this molecule")
    end
end

# These were supposed to be for convenience but created problems downstream

#Base.show(io::IO, ::MIME"text/plain", x::System) = print(io, "Molly.System ($(dim(x))D)")
#Base.show(io::IO, ::MIME"text/plain", x::Type{<:System}) = print(io, "Molly.System (TYPE)")


# Molly.System is not mutable. We provide a constructor creating a new instance with updated fields.
# (This was not possible programmatically since the System type is not inferrable from the fields alone.)
#=
" Constructor to update some fields of the (immutable) Molly.System "
function Molly.System(s::System; kwargs...)
    System(;
        atoms = s.atoms,
        atoms_data = s.atoms_data,
        pairwise_inters = s.pairwise_inters,
        specific_inter_lists = s.specific_inter_lists,
        general_inters = s.general_inters,
        constraints = s.constraints,
        coords = s.coords,
        velocities = s.velocities,
        boundary = s.boundary,
        neighbor_finder = s.neighbor_finder,
        loggers = s.loggers,
        force_units = s.force_units,
        energy_units = s.energy_units,
        k = s.k,
        kwargs...)
end
=#

""" extract the unitful SVector coords from `sys` and return as a normal vector """
getcoords(sys::System) = getcoords(sys.coords)
function getcoords(coords::AbstractArray)
    x0 = Molly.ustrip_vec(coords)
    x0 = reduce(vcat, x0)
    return x0::AbstractVector
end

""" convert normal vector of coords to SVectors of unitful system coords """
function vec_to_coords(x::AbstractArray, sys::System)
    xx = reshape(x, 3, :)
    coord = sys.coords[1]
    u = unit(coord[1])
    coords = typeof(coord)[c * u for c in eachcol(xx)]
    return coords
end

""" set the system to the given coordinates """
# TODO: the centercoords shift does not belong here, fix constant
# Note: Actually the Langevin integrator removes centercoords of mass motion, so we should be fine
setcoords(sys::System, coords) = setcoords(sys, vec_to_coords(centercoords(coords) .+ 1.36, sys))
setcoords(sys::System, coords::Array{<:SVector{3}}) = System(sys;
    coords=coords,
    velocities=copy(sys.velocities)
    #    neighbor_finder = deepcopy(sys.neighbor_finder),
)


## Save to pdb files

function savecoords(sys::System, coords::AbstractVector, path; append=false)
    append || rm(path, force=true)
    writer = Molly.StructureWriter(0, path)
    sys = setcoords(sys, coords)
    Molly.append_model!(writer, sys)
end

function savecoords(sys::System, data::AbstractMatrix, path; append=false)
    append || rm(path, force=true)
    for x in eachcol(data)
        savecoords(sys, x, path, append=true)
    end
end


## loaders for the molecules in /data

const molly_data_dir = joinpath(dirname(pathof(Molly)), "..", "data")

function PDB_6MRR()
    ff = MolecularForceField(
        joinpath(molly_data_dir, "force_fields", "ff99SBildn.xml"),
        joinpath(molly_data_dir, "force_fields", "tip3p_standard.xml"),
        joinpath(molly_data_dir, "force_fields", "his.xml"),
    )
    sys = System(joinpath(molly_data_dir, "6mrr_nowater.pdb"), ff)
    return sys
end

function PDB_5XER()
    sys = System(
        joinpath(dirname(pathof(Molly)), "..", "data", "5XER", "gmx_coords.gro"),
        joinpath(dirname(pathof(Molly)), "..", "data", "5XER", "gmx_top_ff.top");
    )
    #temp = 298.0u"K"
    ## attempt at removing water. not working, some internal data is referring to all atoms
    #nosol = map(sys.atoms_data) do a a.res_name != "SOL" end
    #sys.atoms = sys.atoms[nosol]
    #sys.atoms_data = sys.atoms_data[nosol]
    return sys
end

""" Create a Molly system for the alanine dipeptide without solvent """
function PDB_ACEMD(; kwargs...)
    ff = Molly.MolecularForceField(joinpath(molly_data_dir, "force_fields", "ff99SBildn.xml"))
    sys = System(joinpath(@__DIR__, "..", "data", "alanine-dipeptide-nowater av.pdb"), ff,
        rename_terminal_res=false, # this is important,
        #boundary = CubicBoundary(Inf*u"nm", Inf*u"nm", Inf*u"nm")  breaking neighbor search
        ; kwargs...
    )
    return sys
end

""" Create a Molly system for the small Chignolin protein """
function PDB_1UAO(; rename_terminal_res=true, kwargs...)
    ff = Molly.MolecularForceField(joinpath(molly_data_dir, "force_fields", "ff99SBildn.xml"))
    sys = System(joinpath(@__DIR__, "..", "data", "1uao av.pdb"), ff,
        ; rename_terminal_res, # this is important,
        #boundary = CubicBoundary(Inf*u"nm", Inf*u"nm", Inf*u"nm")  breaking neighbor search
        kwargs...
    )
    return sys
end

""" Create a Molly system for the alanine dipeptide with water """
function PDB_diala_water()
    ff_dir = joinpath(dirname(pathof(Molly)), "..", "data", "force_fields")
    ff = Molly.MolecularForceField(joinpath.(ff_dir, ["ff99SBildn.xml", "tip3p_standard.xml"])...)
    sys = Molly.System(joinpath(@__DIR__, "..", "data", "dipeptide_equil.pdb"), ff; rename_terminal_res=false)
    return sys
end


"""
    OverdampedLangevinGirsanov(; <keyword arguments>)

Simulates the overdamped Langevin equation using the Euler-Maruyama method with an auxilliary control w/u
with σ = sqrt(2KT/(mγ))
dX = (-∇U(X)/(γm) + σu) dt + σ dW

where u is the control function, such that u(x,t) = σ .* w(x,t).
The accumulated Girsanov reweighting is stored in the field `g`

# Arguments
- `dt::S`: the time step of the simulation.
- `temperature::K`: the equilibrium temperature of the simulation.
- `friction::F`: the friction coefficient of the simulation.
- `remove_CM_motion=1`: remove the center of mass motion every this number of steps,
    set to `false` or `0` to not remove center of mass motion.
- `w::Function`: the control function, such that u(x,t) = σ .* w(x,t)
"""
struct OverdampedLangevinGirsanov{S, K, F, Fct}
    dt::S
    temperature::K
    friction::F
    remove_CM_motion::Int
    g::Float64  # the Girsanov integral
    w::Fct
end

function OverdampedLangevinGirsanov(; dt, temperature, friction, w, remove_CM_motion=1, G=0.)
    return OverdampedLangevinGirsanov(dt, temperature, friction, w, Int(remove_CM_motion), G)
end

function simulate!(sys,
                    sim::OverdampedLangevinGirsanov,
                    n_steps::Integer;
                    n_threads::Integer=Threads.nthreads(),
                    run_loggers=true,
                    rng=Random.GLOBAL_RNG)
    sys.coords = wrap_coords.(sys.coords, (sys.boundary,))
    !iszero(sim.remove_CM_motion) && remove_CM_motion!(sys)
    neighbors = find_neighbors(sys, sys.neighbor_finder; n_threads=n_threads)
    run_loggers!(sys, neighbors, 0, run_loggers; n_threads=n_threads)

    for step_n in 1:n_steps
        old_coords = copy(sys.coords)

        dt = sim.dt
        γ = sim.friction
        m = Molly.masses(sys)
        k = sys.k
        T = sim.temperature

        F = forces(sys, neighbors; n_threads=n_threads)
        w = sim.w(sys.coords, sys.time)

        # we reconstruct dB from the Boltzmann velocities
        # this takes care of units and the correct type
        # but maybe sampling ourselves works just as well and is cleaner?
        v = random_velocities(sys, T; rng=rng)
        dB = @. v / sqrt(k * T / m) * sqrt(dt)

        σ = @. sqrt(2 * k * T / (γ * m))

        b = @. (F / (γ * m))
        u = @. σ * w

        sys.coords += @. (b + σ * u) * dt + σ * dB
        sim.g += dot(u, @. u * (dt / 2) + dB)

        apply_constraints!(sys, old_coords, sim.dt)
        sys.coords = wrap_coords.(sys.coords, (sys.boundary,))
        if !iszero(sim.remove_CM_motion) && step_n % sim.remove_CM_motion == 0
            remove_CM_motion!(sys)
        end

        neighbors = find_neighbors(sys, sys.neighbor_finder, neighbors, step_n;
                                   n_threads=n_threads)

        run_loggers!(sys, neighbors, step_n, run_loggers; n_threads=n_threads)
    end
    return sys
end
