# Open Questions relative to Aquarium

- _What are different ways to express control flow logic?_

  I would suggest looking at how this is handled in the UML Activity model.
  The activity model allows you to make a block of the diagram into a loop or a conditional.
  There are also forks and joins, timing, and preconditions.

  It's not control flow, but abstraction is important. I don't see that as an option in the current noflo model.

- _How do we capture provenance?_

  You should expect in Aquarium this information to be captured in the LIMS as the protocol is performed.
  So, in principle, the execution would make API calls to create objects/capture data.

  This API hasn't been defined, but Aquarium LIMS updates will use [PROV-DM](https://www.w3.org/TR/2013/REC-prov-dm-20130430/), which at a minimum includes Entities, Activities and Agents.
  These models can be as simple or complicated as wanted.
  Entities could be either physical or digital — experience says for physical objects, an entity needs to represent the state of the object relative to an action (so, e.g., includes volumes and concentrations).
  An Activity would correspond to an Action execution, with the Agent capturing how the action is performed.

  We currently extract a PROV-DM based model from Aquarium using the python package defined in https://github.com/aquariumbio/aquarium-provenance, but it is not explicitly represented in the system.
  The model uses concepts from Aquarium: items, collections, and files as entities; and operations and jobs as activities.
  The scripts also extract any annotations added to the objects.
  This model does not include any Agents.

- _What does feedback look like?_
- _How do we represent physical objects vs digital info, and how to document changes to physical objects (like the volume of liquid in a well)?_

  Again, I think you can assume that there is a LIMS where physical objects are managed and that you use via an API.
  I think the best strategy is that the current state of the object be represented in the LIMS, and prior states are represented in the provenance.

  Aquarium uses types to describe what information these objects will manage.
  The model we are working toward for types distinguishes the kind of thing (called the "sample" type), the physical state of the thing, and the container it is in.
  Presumably, actions could be polymorphic so working out the type system is key to helping users chain protocols together.
